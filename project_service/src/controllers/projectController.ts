import { Request, Response, RequestHandler } from "express";
import Project from "../models/projectModel";

export const createProject = async (req: Request, res: Response) => {
  console.log(req.url)
  console.log(req.body)

  const { title, description, techStack, category, requiredRoles, problem, solution, createdby } = req.body;


  if (!title || !description || !techStack || !category || !problem || !solution || !requiredRoles || !createdby) {
    return res.status(404).json({ msg: "required credentials are missing..." });

  }
  console.log("munavvur")
  const newProject = new Project({
    title,
    description,
    techStack,
    category,
    solution,
    problem,
    requiredRoles,
    createdby,
  });

  await newProject.save();
  return res.status(201).json({ msg: "project created successfully", project: newProject });

};

export const getAllProjects = async (req: Request, res: Response) => {
  console.log(req.url)

  const project = await Project.find().populate("createdby", "name email profilePicture ");
  res.status(200).json(project)



}

export const getProjectById = async (req: Request, res: Response) => {
  console.log(req.url)
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      res.status(404).json({ msg: "project not found.." })




    }
    res.status(200).json(project)

  } catch (error) {
    res.status(500).json({ msg: "error occured.." })

  }
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({ msg: "project updated succesfully", project: updatedProject })
  } catch (error) {
    res.status(500).json({ msg: "error occured while updating.." })
  }
}

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = Project.findByIdAndDelete(req.params.id)
    if (!project) {
      res.status(404).json({ msg: "project not found.." })
    }
    res.status(200).json({ msg: "project deleted succesfully.." })

  } catch (error) {
    console.log("error occured..")
  }
}