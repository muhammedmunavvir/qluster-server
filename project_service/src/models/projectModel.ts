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
    problem: { type: String, required: true },
    solution:{ type: String, required: true },
    category: { type: [String], required: true },
    requiredRoles:{type:[String],required:true}
   
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;