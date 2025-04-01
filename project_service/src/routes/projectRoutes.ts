import express from "express";
import { createProject,getAllProjects, getProjectById, updateProject } from "../controllers/projectController";


const projectRouter = express.Router(); // ✅ Correct way to initialize router

projectRouter.post("/createProject" , createProject); 
projectRouter.get("/getAllProjects",getAllProjects);
projectRouter.get("/getProject/:id",getProjectById);
projectRouter.put("/getProject/:id",updateProject);

export default projectRouter; // ✅ Ensure export
