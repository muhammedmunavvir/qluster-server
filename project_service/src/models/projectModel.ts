// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true },
//     description: { type: String, required: true },
//     techStack: [{ type: String, required: true }], // Technologies used in the project
//     category: { type: String, required: true }, // Web, Mobile, AI, etc.
//     owner: { type: String, required: true }, // Project Owner
//     contributors: { type:[String] , required: true }, // Contributors
//     roles: { type: [String]}, // Roles (Frontend, Backend, etc.)
//     tasks: { type: [String] }, // Linking tasks
//   },
//   { timestamps: true } // Automatically manages `createdAt` and `updatedAt`
// );

// const Project = mongoose.model("Project", projectSchema);
// export default Project;


import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: [{ type: String, required: true }],
    category: { type: String, required: true },
    owner: { type: String, required: true },
    contributors: { type: [String], required: true },
    roles: { type: [String], required: true }, // Make required if needed
    tasks: { type: [String], required: true }  // Make required to match controller
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;