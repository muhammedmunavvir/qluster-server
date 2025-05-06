// import mongoose from "mongoose";

// const channelSchema = new mongoose.Schema({
//     channelName:{type:String,required:true,trim:true,min:3},
//     projectId:{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:true},
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
//     participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', }],

// },{timestamps:true})

// const Channel = mongoose.model("Channel",channelSchema)
// export default Channel
// channel_service/src/Models/channel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChannel extends Document {
  _id: mongoose.Types.ObjectId;
  channelName: string;
  projectId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const channelSchema = new Schema<IChannel>(
  {
    channelName: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    participants: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

export default mongoose.model<IChannel>("Channel", channelSchema);