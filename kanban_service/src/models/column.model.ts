

// const columnSchema = new mongoose.Schema({

//   boardId:{type:Number, required:true},
//   title:{type:String , required:true},
//   order:{type:Number,default:0},
// })




import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const Columns = mongoose.models.Column || mongoose.model("Column", columnSchema);
export default Columns;