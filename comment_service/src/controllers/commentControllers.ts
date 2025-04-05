import { Request, Response } from "express";
import Comment from "../models/comment.model";

export const addComment = async (req: Request, res: Response) => {
  try {
    const { userId, content, projectId, taskId, parentId } = req.body;

    // Validate required fields
    if (!userId || !content) {
       res.status(400).json({ msg: "userId and content are required." });
    }

    // Ensure a comment belongs to either a project OR a task, not both
    if (projectId && taskId ) { 
        res.status(400).json({ message: "A comment can belong to either a project or a task, not both. cannot add none" });
    }

    // Create a new comment
    const newComment = new Comment({
      userId,
      content,
      projectId: projectId || null,
      taskId: taskId || null,
      parentId: parentId || null,
    });

    await newComment.save();
    
    res.status(201).json({ msg: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ msg: "Server error." });
  }
};


export const getComments = async(req:Request,res:Response) => {

  try{
    const { taskId , projectId} = req.query;

    if(!projectId && !taskId){
      res.status(400).json({msg:"either task or project id is required"})
    }

//fetch comments based on project or task.
let filter = {}

if(taskId){
  filter={taskId}
}
else if(projectId){
  filter={projectId}
}

const comments = await Comment.find(filter);
res.status(201).json(comments)

  }
  catch(error){
    console.error("error occured",error)
    res.status(500).json('server error')

  }

  
}