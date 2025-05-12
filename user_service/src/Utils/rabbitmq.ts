import * as amqplib from 'amqplib';
import { Channel, ConsumeMessage } from 'amqplib';

const RABBITMQ_URL = 'amqp://admin:password@rabbitmq:5672';

const connectToRabbitMQ = async (): Promise<Channel> => {
  try {
    console.log("🔄 Connecting to RabbitMQ...");
    const conn = await amqplib.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    console.log("✅ Connected to RabbitMQ!");
    return ch;
  } catch (error) {
    console.error("❌ RabbitMQ Connection Error:", error);
    throw error;
  }
};

export const publishToQueue = async (queue: string, data: any): Promise<void> => {
  let channel: Channel | null = null;
  try {
    channel = await connectToRabbitMQ();
    await channel.assertQueue(queue);

    let message;

    // If you receive a Map (Mongo returns populated docs sometimes in this way)
    if (data instanceof Map) {
      message = {
        _id: data.get("_id")?.toString() || "",
        name: data.get("name") || "Unknown",
        email: data.get("email") || "Unknown",
        profilePicture: data.get("profilePicture") || "",
        coverImage: data.get("coverImage") || "",
        bio: data.get("bio") || "",
        profession: data.get("profession") || "",
        location: data.get("location") || "",
        skills: data.get("skills") || [],
        role: data.get("role") || "user",
        portfolio: data.get("portfolio") || "",
        github: data.get("github") || "",
        linkedin: data.get("linkedin") || "",
        isVerified: data.get("isVerified") || false,
        createdAt: data.get("createdAt")
          ? new Date(data.get("createdAt")).toISOString()
          : null,
        updatedAt: data.get("updatedAt")
          ? new Date(data.get("updatedAt")).toISOString()
          : null,
      };
    } else {
      // Assume it's a plain object or mongoose document
      message = {
        _id: data._id?.toString() || "",
        name: data.name || "Unknown",
        email: data.email || "Unknown",
        profilePicture: data.profilePicture || "",
        coverImage: data.coverImage || "",
        bio: data.bio || "",
        profession: data.profession || "",
        location: data.location || "",
        skills: data.skills || [],
        role: data.role || "user",
        portfolio: data.portfolio || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        isVerified: data.isVerified || false,
        createdAt: data.createdAt
          ? new Date(data.createdAt).toISOString()
          : null,
        updatedAt: data.updatedAt
          ? new Date(data.updatedAt).toISOString()
          : null,
      };
    }

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message), "utf-8"));
    console.log(`📤 Message sent to queue "${queue}"`);
  } catch (error) {
    console.error("❌ RabbitMQ Publish Error:", error);
    throw error;
  } finally {
    if (channel) {
      await channel.close();
    }
  }
};


// Consumer function
export const consumeFromQueue = async (
  queue: string,
  callback: (data: any) => Promise<void>
): Promise<void> => {
  try {
    const channel = await connectToRabbitMQ();
    await channel.assertQueue(queue);
    console.log(`📥 Waiting for messages in queue "${queue}"`);

    channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg) {
        try {
          const messageContent = msg.content.toString();
          const parsedData = JSON.parse(messageContent);
          console.log(`🔔 Received message from "${queue}":`, parsedData);

          await callback(parsedData); // Process message with custom handler

          channel.ack(msg); // Acknowledge successful processing
        } catch (error) {
          console.error("❌ Error processing message:", error);
          channel.nack(msg); // Reject message and requeue
        }
      }
    });
  } catch (error) {
    console.error("❌ Error consuming from queue:", error);
  }
};