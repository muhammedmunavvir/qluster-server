import mongoose  from "mongoose";

const peerChatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: String,
},{timestamps:true})

const PeerChat = mongoose.model("peerChat",peerChatSchema)
export default PeerChat