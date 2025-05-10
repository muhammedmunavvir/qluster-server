import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: [{ type: String, required: true }],
    problem: { type: String, required: true },
    solution:{ type: String, required: true },
    category: { type: [String], required: true },
    requiredRoles:{type:[String],required:true},
    createdby: { type: mongoose.Schema.Types.ObjectId, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed", "On Hold"],
      default: "Planning",
    },
    author: {
      name: { type: String, default: "" },
      avatar: { type: String, default: "" },
      title: { type: String, default: "" },
      company: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    team: [
      {
        name: { type: String, default: "" },
        avatar: { type: String, default: "" },
        role: { type: String, default: "" },
      },
    ],
    updates: [
      {
        date: { type: Date, default: Date.now },
        content: { type: String, default: "" },
      },
    ],
    resources: [
      { 
        type: {
          type: String,
          enum: ["document", "repository", "link"],
        },
        name: { type: String, default: "" },
        url: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true } 
);

const Project = mongoose.model("Project", projectSchema);
export default Project;