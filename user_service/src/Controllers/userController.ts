import { Request, Response } from "express"
import User from "../Models/userModel"
import { loginValidation, signupValidation } from "../Validation/userValidation"
import { doHash, doHashValidation } from "../Utils/hashing"
import { generateAccesstoken } from "../Utils/token"
import { access } from "fs"

export const signup = async(req:Request,res:Response)=>{
    const {name,email,password} =req.body
    // console.log(req.body);
    const {error, value} =  signupValidation.validate({name,email,password})
    if(error){
        res.status(401).json({success:false,message:error.details[0].message})
    }
    const existingUser= await User.findOne({email})
    if(existingUser){
       return res.status(400).json({success:false,message:"User already Exists"})
    }
    const hashPassword=await doHash(password,12)
    const newUser = new User({
        name,
        email,
        password:hashPassword
    })
    await newUser.save()
    newUser.password = undefined
    res.status(200).json({success:true,message:"Your account hasbeen created successfully",data:newUser})
}

  
export   const login = async (req:Request,res:Response)=>{  
    const {email,password}=req.body
    const {error } =loginValidation.validate({email,password}) 
    if(error){
        return res.status(400).json({success:false,message:error.details[0].message})
    }
    const existingUser = await User.findOne({email})
    if(!existingUser){
      return res.status(400).json({success:false,message:"User not found"})
    }
    const credential = await doHashValidation(password,existingUser.password ?? "")
    if(!credential){
        return res.status(400).json({success:false ,message: "Invalid credential!"})
    }
    const accessToken = generateAccesstoken({
        userId: existingUser._id.toString(),  
        email:existingUser.email ?? "",
        role: existingUser.role ?? "user",  
    })
            res.cookie("accessToken", accessToken, {
                httpOnly: true,  
                secure:false,
                maxAge: 24 * 60 * 60 * 1000 
            });

    existingUser.password = undefined
    res.status(200).json({success:true,message:"Successfully loged",data:existingUser})
}


exports.logOut = async (req:Request,res:Response) =>{
    res.clearCookie("accessToken")
    res.status(200).json({success:true,message:"Logged out successfully"})      
}


interface CustomRequest extends Request {
    user?: { userId: string }; 
  }
exports.editProfie = async (req:CustomRequest,res:Response)=>{
    const userId = req.user?.userId
    let {name,bio,skills ,portfolio,github,linkedin,profilePicture,converImage} = req.body;
        // const image =req.file?.path
        // console.log(image);
        
    const updateProfile = await User.findByIdAndUpdate(
        userId,
        {$set :{name,bio,skills,portfolio,github,linkedin,profilePicture,converImage}},
        {new:true}
    )
    if(!updateProfile){
       return res.status(404).json({success:false,message : "User Not found"})
    }
    updateProfile.password = undefined
    res.status(200).json({success:true,message:"Successfully updated your profile",data:updateProfile})
}