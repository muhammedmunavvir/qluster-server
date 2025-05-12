
import * as amqplib from "amqplib";

const RABBITMQ_URL =  "amqp://admin:password@rabbitmq:5672";

let connection: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

async function connectToRabbitMQ(): Promise<void> {
  try {
    if (!connection) {
      console.log("Connecting to RabbitMQ...");
      connection = await amqplib.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      console.log("Connected to RabbitMQ!");
    }
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
    throw error;
  }
}

export async function consumeFromQueue(queue: string, callback: (message: any) => void): Promise<void> {
  try {
    await connectToRabbitMQ();
    if (!channel) throw new Error("Channel is not initialized");

    await channel.assertQueue(queue, { durable: true });
    console.log(`📥 Waiting for messages in queue: ${queue}...`);

    channel.consume(
      queue,
      (msg: amqplib.ConsumeMessage | null) => {
        if (msg) {
          console.log("🟢 Raw message received:", msg.content.toString("utf-8"));
          try {
            const data = JSON.parse(msg.content.toString("utf-8"));
            callback(data);
            channel?.ack(msg);
          } catch (error) {
            console.error("Error parsing message:", error);
            channel?.nack(msg, false, false);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("RabbitMQ Consumer Error:", error);
  }
}

// Clean up on process exit
process.on("SIGINT", async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  process.exit(0);
});