import { required } from "joi"
import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
  "userId":{type:Number,required:true},
  "content":{type:String,required:true},
  "projectId":{type:Number,default:null},
  "taskId":{type:Number,default:null},
  "parentId":{type:Number,default:null},//if no parentId means not threaded reply means parentId is null
},{timestamps:true})

const Comment = mongoose.model("Comment",commentSchema)
export default Comment