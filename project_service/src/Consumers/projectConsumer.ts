import Project from "../models/projectModel";
import { consumeFromQueue } from "../utils/rabbitmq/rabbitmqConsumer";
import { publishToQueue} from "../utils/rabbitmq/rabbitmqPublisher"

async function startConsumer() {
  console.log("Initializing RabbitMQ consumer...");

  await consumeFromQueue("specificProject", async (data) => {
    console.log("Project service received request for all projects:", data);

    try {
      const project = await Project.findById(data); 

      if (project) {
        console.log("Sending project list to channel service");
        await publishToQueue("projectData", project);
      } else {
        console.warn("No project found");
        await publishToQueue("projectData", []);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      await publishToQueue("projectData", []);
    }
  });
}

startConsumer().catch((err) => console.error("Failed to start consumer:", err));