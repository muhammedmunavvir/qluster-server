
import amqplib from "amqplib";

const RABBITMQ_URL =  "amqp://admin:password@rabbitmq:5672";

let connection: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

async function connectToRabbitMQ(): Promise<void> {
  try {
    if (!connection) {
      console.log("Connecting to RabbitMQ...");
      connection = await amqplib.connect(RABBITMQ_URL); // Assign to global
      channel = await connection.createChannel();
      console.log("Connected to RabbitMQ!");
    }
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
    throw error;
  }
}

export async function publishToQueue(queue: string, message: any): Promise<void> {
  try {
    await connectToRabbitMQ();
    if (!channel) throw new Error("Channel is not initialized");

    await channel.assertQueue(queue, { durable: true });
    console.log(queue, "====que");

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  } catch (error) {
    console.error("RabbitMQ Publish Error:", error);
    throw error;
  }
}

// Clean up on process exit
process.on("SIGINT", async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  process.exit(0);
});