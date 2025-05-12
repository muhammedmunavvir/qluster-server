import { Server } from "socket.io";
import PeerChat from "../Models/peerChat";

const peerChatSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected💬:", socket.id);

    socket.on("join", ({ userId }) => {
      socket.join(userId);
    });

    // 🔹 Fetch previous messages when receiver is selected
    socket.on("load_messages", async ({ user1, user2 }) => {
      try {
        const messages = await PeerChat.find({
          $or: [
            { sender: user1, receiver: user2 },
            { sender: user2, receiver: user1 },
          ],
        }).sort({ createdAt: 1 });

        socket.emit("previous_messages", messages);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    });

    // 🔹 Handle sending private message
    socket.on("private_message", async ({ sender, receiver, content }) => {      
      try {
        const message = new PeerChat({ sender, receiver, content });
        await message.save();

        io.to(sender).emit("message", message);
        io.to(receiver).emit("message", message);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default peerChatSocket;
