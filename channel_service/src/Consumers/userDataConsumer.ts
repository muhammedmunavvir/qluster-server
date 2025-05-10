
import { consumeFromQueue } from "../Utils/rabbitmq/rabbitmqConsumer";
import { publishToQueue } from "../Utils/rabbitmq/rabbitmqPublisher";

const userCache = new Map<string, any>();

async function startConsumer() {
  console.log("Initializing RabbitMQ consumer in channel service...");

  await consumeFromQueue("userData", async (data) => {
    console.log("Received userData:", data);

    if (!data.userId) {
      console.warn("Missing userId in userData:", data);
      return;
    }

    if (data.error) {
      console.warn(`Error from user service for user ${data.userId}: ${data.error}`);
      userCache.set(data.userId, null);
      return;
    }

    if (data._id && data.name) {
      userCache.set(data.userId, data);
      console.log(`Cached user ${data.userId}:`, userCache.get(data.userId));
    } else {
      console.warn(`Invalid user data for user ${data.userId}:`, data);
      userCache.set(data.userId, null);
    }
  });
}

startConsumer().catch((err) => console.error("Failed to start consumer:", err));

export async function getSpecificUserData(userId: string): Promise<any> {
  if (userCache.has(userId)) {
    const user = userCache.get(userId);
    if (user === null) {
      console.warn(`User ${userId} not found in cache (previously failed)`);
      return null;
    }
    return user;
  }

  console.log(`Requesting user ${userId} from user service`);
  await publishToQueue("specificUser", userId);
  return null;
}