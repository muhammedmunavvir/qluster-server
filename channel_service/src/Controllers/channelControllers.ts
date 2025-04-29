import { Request, Response } from "express"
import Channel from "../Models/channelModels";
import { publishToQueue } from "../Utils/rabbitmq/rabbitmqPublisher";
import { getSpecificProjectData } from "../Consumers/projectDataConsumer";

interface CustomRequest extends Request {
  user?: { userId: string }; 
}
  export const createChannel = async (req:CustomRequest,res:Response)=>{
    const {channelName,projectId}=req.body
    const userId = req.user?.userId

    if(!userId){
      return  res.status(404).json({ message: 'User not found' });
    } 
    if (!channelName || !projectId) {
        return res.status(400).json({ message: 'Channel name and projectId are required' });
      }
       await publishToQueue("specificProject",projectId)

       await new Promise((res)=>{setTimeout(res,1500)})
      //  const specificProject = (await getSpecificProjectData(projectId)) as 
       const specificProject = await getSpecificProjectData(projectId)
      // const project = await Project.findById(projectId);
      if (!specificProject) {
        return res.status(404).json({ message: 'Project not found' });
      }  
      const existingChannel = await Channel.findOne({ channelName, projectId });
      if (existingChannel) {
        return res.status(400).json({ message: 'A channel with this name already exists in this project' });
      }
      const channel = new Channel({
        channelName,
        projectId,
        createdBy: userId,
        participants: [userId],
      });

      await channel.save()
      return res.status(201).json({ message: 'Channel created successfully', data:channel });
}


export const addParticipant = async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    if (channel.participants.includes(userId)) {
      return res.status(400).json({ message: "User is already a participant" });
    }

    channel.participants.push(userId);
    await channel.save();

    res.status(200).json({ message: "Participant added successfully", channel });
  
};


export const removeParticipant = async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    if (!channel.participants.includes(userId)) {
      return res.status(400).json({ message: "User is not a participant" });
    }
    channel.participants = channel.participants.filter(id => id.toString() !== userId);
    await channel.save();

    res.status(200).json({ message: "Participant removed successfully", channel });
  
};

