import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName:{type:String,required:true,trim:true,min:3},
    projectId:{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', }],
    messages: [{
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: String,
        fileUrl: String,
        createdAt: { type: Date, default: Date.now, },
      }]

},{timestamps:true})

const Channel = mongoose.model("Channel",channelSchema)
export default Channel