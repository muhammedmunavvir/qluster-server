import { required } from "joi";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

  "title":{type:String, required:true},
  "description":{type:String,required:true},
  "projectId":{type:Number,required:true},
  "assignedTo":{type:String,required:true},
  "priority": {type:String,enum:["Low","Medium","High"]},
  "status":{type:String,enum:['To do','In Progress','Completed']},
  "comments": [{type: String,required: false,}],
},{timestamps:true})


const Task = mongoose.model("Task",taskSchema)
export default Task;
