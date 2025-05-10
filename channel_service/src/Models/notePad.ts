import mongoose from "mongoose";

const notePadSchema = new mongoose.Schema({
    channelId:{type:mongoose.Schema.Types.ObjectId,ref:"Channel",required:true},
    content: { type: String, default: '' },

})

const NotePad = mongoose.model("NotePad",notePadSchema)
export default NotePad