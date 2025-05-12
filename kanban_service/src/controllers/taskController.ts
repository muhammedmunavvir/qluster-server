import { Request,Response } from "express";
import Task from "../models/Task.model";

export const createTask = async (req:Request,res:Response) =>{

try
{  const {title,description,projectId,assignedTo,status,comments,ColumnId,priority} = req.body;

  if(!title ||  !description || !projectId || !assignedTo || !status || !comments || !ColumnId){
   return   res.status(500).json("credentials are missing")
  }

  const newTask = new Task({
    title,
    description,
    projectId,
    assignedTo,
    ColumnId,
    status,
    comments,
    priority

  })

  await newTask.save();
   return res.status(201).json(newTask)
}
catch(error){
  console.log("error occured..",error);
  return res.status(400).json("error occured...");
}
}

export const getAllTask = async(req:Request,res:Response) => {
  try{
    const task = await Task.find()
    res.status(201).json(task)

  }catch(error){
    res.status(500).json("error occured..")

  }

}


export const updateTask = async (req:Request,res:Response) => {
  try
  {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true});
  res.status(201).json(updatedTask)
  }
catch(error){
  console.log("error occured..")
  res.status(500).json("server error...")

}
}

export const getTaskById = async(req:Request,res:Response) =>{
  try
  {
    const task = await Task.findById(req.params.id);
  if(!task){
    res.status(400).json("no task found with the id..")
  }

  res.status(201).json(task)
}catch(error){
  console.log(error,"error occured..")
  res.status(400).json("error occuredd...")
}
}

export const deleteTask = async(req:Request,res:Response) =>{
  try{
    const task = await Task.findByIdAndDelete(req.params.id)
    if(!task){
      res.status(404).json("no task found on the provided id")
    }
    res.status(200).json("task deleted succesfully..")
  }catch(error){
    console.log(error,"error occured..");
    res.status(500).json("server error")

  }

}