import { required } from "joi";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

  "title":{type:String, required:true},
  "description":{type:String,required:true},
  "projectId":{type:Number,required:true},
  "ColumnId":{type: mongoose.Schema.Types.ObjectId, ref: "Columns", required: true},
  "assignedTo":{type:String,required:true},
  "priority": {type:String,enum:["Low","Medium","High"]},
  "comments": [{type: String,required: false,}],
  "order":{type:Number,default:0},
 
},{timestamps:true})


const Task = mongoose.model("Task",taskSchema)
export default Task;
