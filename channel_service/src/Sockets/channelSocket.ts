import ChannelChat from "../Models/channelChat";
import { IChannel } from "../Models/channelModels";
import mongoose from "mongoose";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { publishToQueue } from "../Utils/rabbitmq/rabbitmqPublisher";
import { getSpecificUserData } from "../Consumers/userDataConsumer";

interface SendMessagePayload {
  groupId: string;
  senderId: string;
  chat: string;
  media?: string;
}

async function fetchUser(senderId: string): Promise<any> {
  try {
    if (!Types.ObjectId.isValid(senderId)) {
      console.error(`Invalid senderId: ${senderId}`);
      return null;
    }

    const cachedUser = await getSpecificUserData(senderId);
    if (cachedUser) {
      console.log(`User ${senderId} found in cache`);
      return {
        name: cachedUser.name,
        email: cachedUser.email || "unknown@example.com",
        profilePicture: cachedUser.profilePicture,
      };
    }

    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Requesting user ${senderId} via RabbitMQ (attempt ${attempt})`);
        await publishToQueue("specificUser", senderId);

        const start = Date.now();
        const timeoutMs = 5000;
        const pollIntervalMs = 500;
        while (Date.now() - start < timeoutMs) {
          const user = await getSpecificUserData(senderId);
          if (user) {
            console.log(`Received user ${senderId} from RabbitMQ`);
            return {
              name: user.name,
              email: user.email || "unknown@example.com",
              profilePicture: user.profilePicture,
            };
          }
          await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
        }
        console.warn(`Timeout waiting for user ${senderId} on attempt ${attempt}`);
      } catch (error: any) {
        console.error(`Publish error for user ${senderId} on attempt ${attempt}:`, error.message);
      }
    }

    console.error(`Failed to fetch user ${senderId} after ${maxAttempts} attempts`);
    return null;
  } catch (error: any) {
    console.error(`Failed to fetch user ${senderId}:`, {
      message: error.message,
      stack: error.stack,
    });
    return null;
  }
}

export const channelSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected 🫂 :", socket.id);

    socket.on("joinChannel", async (channelId: string) => {
      try {
        if (!Types.ObjectId.isValid(channelId)) {
          console.error("Invalid channelId:", channelId);
          socket.emit("error", { message: "Invalid channel ID" });
          return;
        }

        const channel = await mongoose.model<IChannel>("Channel")
          .findById(channelId)
          .select("channelName")
          .lean();
        if (!channel) {
          console.error(`Channel ${channelId} not found`);
          socket.emit("error", { message: "Channel not found" });
          return;
        }

        socket.join(channelId);
        console.log(`User ${socket.id} joined channel ${channelId}`);

        const messages = await ChannelChat.find({ channel: channelId })
          .sort({ createdAt: 1 })
          .lean();

        const enrichedMessages = await Promise.all(
          messages.map(async (msg) => {
            const sender = await fetchUser(msg.sender.toString());
            return {
              ...msg,
              sender: sender
                ? { _id: msg.sender.toString(), ...sender }
                : { _id: msg.sender.toString(), name: "Unknown User" },
              channel: { _id: channelId, channelName: channel.channelName },
            };
          })
        );

        console.log(`Fetched ${enrichedMessages.length} messages for channel ${channelId}`);
        socket.emit("previousMessages", enrichedMessages);
      } catch (error: any) {
        console.error("Error joining channel:", error.message, error.stack);
        socket.emit("error", { message: `Failed to join channel: ${error.message}` });
      }
    });

    socket.on("sendMessage", async (data: SendMessagePayload, callback) => {
      try {
        const { groupId: channelId, senderId, chat, media } = data;
        console.log("Received message:", data);

        if (!chat) {
          console.error("Chat message required");
          callback({ error: "Chat message required" });
          return;
        }
        if (!Types.ObjectId.isValid(channelId) || !Types.ObjectId.isValid(senderId)) {
          console.error("Invalid IDs:", { channelId, senderId });
          callback({ error: "Invalid channel or sender ID" });
          return;
        }

        const channel = await mongoose.model<IChannel>("Channel")
          .findById(channelId)
          .select("channelName")
          .lean();
        if (!channel) {
          console.error(`Channel ${channelId} not found`);
          callback({ error: "Channel not found" });
          return;
        }

        const sender = await fetchUser(senderId);
        if (!sender) {
          console.error(`User ${senderId} not found via RabbitMQ`);
          callback({ error: "User not found" });
          return;
        }

        const message = new ChannelChat({
          sender: senderId,
          channel: channelId,
          chat,
          media,
        });
        await message.save();
        console.log(`Saved message ${message._id} for channel ${channelId}`);

        const enrichedMessage = {
          ...message.toObject(),
          sender: { _id: senderId, ...sender },
          channel: { _id: channelId, channelName: channel.channelName },
        };

        io.to(channelId).emit("receiveMessage", enrichedMessage);
        console.log(`Emitted message ${message._id} to channel ${channelId}`);
        callback({ status: "success", message: enrichedMessage });
      } catch (error: any) {
        console.error("Error sending message:", error.message, error.stack);
        callback({ error: `Failed to send message: ${error.message}` });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};