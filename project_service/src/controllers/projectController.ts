import { Request, Response, RequestHandler } from "express";
import Project from "../models/projectModel";

export const createProject: RequestHandler = async (req: Request, res: Response) => {
  console.log(req.url)
  console.log(req.body) 
  try { 
    const { title, description, techStack, category, owner, contributors, RequiredRoles,  } = req.body;

    if (!title || !description || !techStack || !category || !owner || !contributors ) {
       res.status(404).json({ msg: "required credentials are missing..." });
       return;
    }

    const newProject = new Project({
      title,
      description,
      techStack,
      category,
      owner,
      contributors,
      RequiredRoles,
     
    });

    await newProject.save();
     res.status(201).json({ msg: "project created successfully", project: newProject });
  } catch (error) {
    console.log("what the ....")
    console.log("error occurred:", error);
     res.status(500).json({ msg: "server error" });
  }
};

export const getAllProjects = async (req:Request,res:Response) =>{
  try{
    const project = await Project.find();
    res.status(200).json(project)
  }
  catch(error){
    console.log("error occured while fetching the project ",error)
    res.status(500).send("error occured")
  }
}

export const getProjectById = async (req:Request, res:Response) =>{
  try{
    const project = await Project.findById(req.params.id)
    
    if(!project){
       res.status(404).json({msg:"project not found.."})



       
    }
    res.status(200).json(project)

  }catch(error){
     res.status(500).json({msg:"error occured.."})

  }
}

export const updateProject = async (req:Request, res:Response) => {
  try
  {
  const updatedProject = await Project.findByIdAndUpdate(req.params.id,req.body ,{new: true}) 
  res.status(200).json({msg:"project updated succesfully",project:updatedProject})
}catch(error){
  res.status(500).json({msg:"error occured while updating.."})
}
}

export const deleteProject = async(req:Request,res:Response)=> {
  try{
    const project = Project.findByIdAndDelete(req.params.id)
    if(!project){
      res.status(404).json({msg:"project not found.."})
    }
    res.status(200).json({msg:"project deleted succesfully.."})

  }catch(error){
    console.log("error occured..")
  }
}