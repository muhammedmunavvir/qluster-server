import { Response,Request } from "express";
import Board from "../models/board.model";
import { Server } from "http";
import Column from "../models/column.model";


export const createBoard = async (req: Request, res: Response) => {
  try {
    const { projectId, createdBy, name } = req.body;

    if (!projectId || !createdBy || !name) {
       res.status(400).json({ message: "Missing required fields" });
    }

    const board = await Board.create({ projectId, createdBy, name });

    if (!board) {
       res.status(500).json({ message: "Board creation failed" });
    }

    console.log("Created board:", board);

    const defaultColumns = ["To Do", "In Progress", "Completed"];
    const columnData = defaultColumns.map((title, index) => ({
      title,
      boardId: board._id,
      order: index
    }));

    console.log("Column data to insert:", columnData); // Debug log
    await Column.insertMany(columnData);

     res.status(201).json({ message: "Board and default columns created", board });
  } catch (error) {
    console.error("Error creating board and columns:", error);
     res.status(500).json({ message: "Failed to create board" });
  }
};




export const getBoard = async(req:Request,res:Response) =>{

  try{
    const {projectId} = req.params;
    const board = await Board.findOne({projectId})

    if(!board){
      res.status(500).json({msg:"board cannot boe found"})
    }
    res.status(201).json({msg:"board found",board:board})

  }catch(error){
    console.log("error occured",error)
    res.status(400).json("server error")

  }

}

export const deleteBoard = async(req:Request,res:Response) =>{
  try
  {
    const {boardId} = req.params
  const board = await Board.findById(boardId);

  if(!board){
    res.status(400).json({msg:"cannot find the board.."})
  }
  await Board.findByIdAndDelete(boardId);
  await Column.deleteMany({boardId})
  res.status(200).json("board deleted succesfully..")
}
catch(error){
  console.log("error occured..",error)
  res.status(404).json("server error")
}


}