import { required } from 'joi';
import mongoose from 'mongoose';

const boardSchema  = new mongoose.Schema({
  projectId:{
    type:Number,
    required:true,
  },
  name:{
    type:String,
    default:'Kanban Board'
  },
  createdBy:{
    type:String,

  }
},{timestamps:true})

const Board = mongoose.model("Board",boardSchema)
export default Board;