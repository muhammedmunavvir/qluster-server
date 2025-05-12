import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  columnId: { type: String, enum: ["todo", "inProgress", "done"], required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  comments: [{ type: String }],
  order: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;
 