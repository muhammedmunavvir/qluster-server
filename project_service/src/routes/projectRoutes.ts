import express from "express";
import { createProject,getAllProjects, getProjectById, updateProject } from "../controllers/projectController";
import {asyncErrorhandler} from "../Middlewares/asyncErrorHandler"

const projectRouter = express.Router(); // ✅ Correct way to initialize router

projectRouter.post("/createProject" ,asyncErrorhandler(createProject)); 
projectRouter.get("/getAllProjects",asyncErrorhandler(getAllProjects));
projectRouter.get("/getProject/:id",getProjectById);
projectRouter.put("/getProject/:id",updateProject);

export default projectRouter; // ✅ Ensure export
