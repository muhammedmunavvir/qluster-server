import { Request, Response } from "express"
import mongoose from "mongoose"
import User from "../Models/userModel"

interface CustomRequest extends Request {
    user?: { userId: string }; 
  }

export const endorseSkill = async (req: CustomRequest, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
   try{
    const { userId } = req.params
    const { skill } = req.body
    const endorserId = req.user?.userId

    if (!skill || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid input" })
    }
    const user = await User.findById(userId).session(session)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    if(userId === endorserId){
        return res.status(400).json({ message: "You cannot endorse your own skills" })
    }
    if (!user.skills.includes(skill)) {
      return res.status(400).json({ message: "User doesn't have this skill" })
    }
    const alreadyEndorsed = user.endorsements.some(
      (item) => item.skill === skill && item.endorsedBy?.toString() === endorserId?.toString()
    )
    // if (alreadyEndorsed) {
    //   return res.status(400).json({ message: "You've already endorsed this skill" })
    // }
    user.endorsements.push({
      skill,
      endorsedBy: endorserId,
    })
    await user.save({ session })

    await session.commitTransaction()
    res.status(200).json({ message: "Skill endorsed successfully",data:user})
    }catch (err){
        console.log(err);
         await session.abortTransaction()
    }finally{
        await session.endSession()
    }
}

export const removeEndorsement = async (req: CustomRequest, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()  
  try{
    const { userId } = req.params
    const { skill } = req.body
    const endorserId = req.user?.userId

    if (!skill || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid input" })
    }
    const user = await User.findById(userId).session(session)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const endorsementIndex = user.endorsements.findIndex(
      (e) => e.skill === skill && e.endorsedBy?.toString() === endorserId?.toString()
    )

    if (endorsementIndex === -1) {
      return res.status(400).json({ message: "Endorsement not found" })
    }

    user.endorsements.splice(endorsementIndex, 1)
    await user.save({ session })

    await session.commitTransaction()
    res.status(200).json({ message: "Endorsement removed successfully" ,data:user})
}catch (err){
    console.log( err);
    session.abortTransaction()
}finally{
    session.endSession()
}
}

export const getUserEndorsements = async (req: Request, res: Response) => {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" })
    }
    const user = await User.findById(userId)
      .select("skills endorsements")
      .populate({ path: "endorsements.endorsedBy",select: "_id name profilePicture", })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    const skillEndorsements = user.skills.map((skill) => {
      const endorsements = user.endorsements.filter((e) => e.skill === skill)
      return {
        skill,
        count: endorsements.length,
        endorsers: endorsements.map((e) => e.endorsedBy),
      }
    })

    return res.status(200).json(skillEndorsements)

}