
import User from "../Models/userModel";
import { consumeFromQueue } from "../Utils/rabbitmq/rabbitmqConsumer";
import { publishToQueue } from "../Utils/rabbitmq/rabbitmqPublisher";
import mongoose from "mongoose";

async function startConsumer() {
  console.log("Initializing RabbitMQ consumer in user service...");

  await consumeFromQueue("specificUser", async (data) => {
    console.log("Received user request:", data);

    try {
      if (!mongoose.Types.ObjectId.isValid(data)) {
        console.warn(`Invalid userId: ${data}`);
        await publishToQueue("userData", { userId: data, error: "Invalid userId" });
        return;
      }

      const user = await User.findById(data).select("name email profilePicture").lean();
      if (user) {
        console.log(`Found user ${data}, publishing to userData queue`);
        await publishToQueue("userData", {
          userId: data,
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        });
      } else {
        console.warn(`User ${data} not found`);
        await publishToQueue("userData", { userId: data, error: "User not found" });
      }
    } catch (error: any) {
      console.error(`Error fetching user ${data}:`, error.message);
      await publishToQueue("userData", { userId: data, error: "Server error" });
    }
  });
}

startConsumer().catch((err) => console.error("Failed to start consumer:", err));