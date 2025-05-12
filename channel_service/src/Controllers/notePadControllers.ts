import { Request, Response } from "express";
import NotePad from "../Models/notePad";

export const getNotePad = async (req:Request,res:Response)=>{
      const {channelId} = req.params

      let  notePad = await NotePad.findOne({channelId})
      if (!notePad) {
        notePad = await NotePad.create({ channelId, content: '' });
      }
      return res.status(200).json({sucess:true,data:notePad})

}

export const updateNotePad = async (req:Request,res:Response)=>{
    const {channelId} = req.params
    const {content} = req.body
 
    if(!channelId ||  typeof content !== "string" ){
        return res.status(404).json({sucess:true,message:"channelId and content are required'"})
    }
    const notePad = await NotePad.findOneAndUpdate(
        {channelId},
        {content},
        {new:true}
    )
    return res.status(200).json({sucess:true,data:notePad})

}