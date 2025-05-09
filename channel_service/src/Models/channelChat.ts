import mongoose from "mongoose";

const channelChatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    chat: { type: String},
    media: { type: String }

},{timestamps:true})
const ChannelChat = mongoose.model("ChannelChat",channelChatSchema)
export default ChannelChat