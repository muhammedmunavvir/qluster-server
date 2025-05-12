

import { Request, Response } from "express";
import Columns from "../models/column.model";



//get all columns for a board
export const getColumsByBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const columns = await Columns.find({ boardId })
    res.status(200).json(columns)

  } catch (error) {
    res.status(500).json({ msg: "failed to get columns" })
  }
}





export const createColumn = async (req: Request, res: Response) => {

  try {
    const { boardId, title, order } = req.body;

    const newColumn = await Columns.create({ boardId, title, order })

    res.status(200).json("column created succesfully....")
  }
  catch (error) {
    console.log(error, "error occured..")
  }
}





export const renameColumn = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;
    const { title } = req.body;


    const updatedColumn = await Columns.findByIdAndUpdate(columnId, { title }, { new: true });
    res.status(201).json({ msg: "column name updated succesfully", data: updatedColumn })
  }
  catch (error) {
    console.log(error, "error occured..")
    res.status(400).json("error occured")

  }
}




export const reOrderColumn = async (req: Request, res: Response) => {
  try {
    const { column } = req.body;//col id and order

   
    /////here the drag and drop working...////
    const updatedPromise = column.map((col: any) => {
      return Columns.findByIdAndUpdate(col.columnId, { order: col.order }, { new: true })
    });

    const updatedColumns = await Promise.all(updatedPromise);

     res.status(200).json({ message: "column re-ordered successfully", data: updatedColumns });

    //////////////////////////////////////////

  } catch (error) {
    console.error("error occurred:", error);
     res.status(500).json({ message: "error occurred while changing the order" });
  }
}


