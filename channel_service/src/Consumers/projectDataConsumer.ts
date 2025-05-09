
import { consumeFromQueue } from "../Utils/rabbitmq/rabbitmqConsumer";

const projectCache = new Map<string, any>();

async function startConsumer() {
    console.log("Initializing RabbitMQ consumer...");
  
    await consumeFromQueue("projectData", async (data) => {
      console.log("====");
      
        if (data) {
          projectCache.set(data._id, data);          
            console.log("project consumer received project_fetched event:", projectCache);
        }
    });
}

startConsumer().catch((err) => console.error("Failed to start consumer:", err));

export function getSpecificProjectData(projectId: string) {  
    return new Promise((resolve, reject) => {
        const checkCache = () => {
            if (projectCache.has(projectId)) {
                resolve(projectCache.get(projectId));
            } else {
                setTimeout(checkCache, 500); // Retry after 500ms
            }
        };
        checkCache();
    });
}
