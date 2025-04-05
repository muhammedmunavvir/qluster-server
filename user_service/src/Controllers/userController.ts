import { Request, Response } from "express"
import User from "../Models/userModel"
import { loginValidation, signupValidation } from "../Validation/userValidation"
import { doHash, doHashValidation } from "../Utils/hashing"
import { generateAccesstoken } from "../Utils/token"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken";

export const signup = async(req:Request,res:Response)=>{
    const {name,email,password} =req.body
    console.log(req.body);
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

// // Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS, 
//     },
// });

// // Signup with Email Verification
// export const signup = async (req: Request, res: Response) => {
//     const { name, email, password } = req.body;

//     const { error } = signupValidation.validate({ name, email, password });
//     if (error) {
//         return res.status(400).json({ success: false, message: error.details[0].message });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         return res.status(400).json({ success: false, message: "User already exists" });
//     }
//     const hashPassword = await doHash(password, 12);
//     const newUser = new User({
//         name,
//         email,
//         password: hashPassword,
//         isVerified: false,  
//     });

//     // Generate email verification token
//     const emailToken = jwt.sign(
//         { name, email, password: hashPassword },
//         process.env.JWT_SECRET as string,
//         { expiresIn: "1h" } // Link valid for 1 hour
//     );

//     // Generate magic link
//     const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailToken}`;
//     // Send verification email
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "Verify Your Email - Magic Link",
//         html: `<p>Click the link below to verify your email and activate your account:</p>
//                <a href="${verificationLink}">${verificationLink}</a>
//                <p>This link expires in 1 hour.</p>`,
//     };
//     await transporter.sendMail(mailOptions);
//     await newUser.save()
//     res.status(200).json({ success: true, message: "Verification email sent. Please check your inbox." ,verificationLink});
// };

// export const verifyEmail = async (req: Request, res: Response) => {
//     const { token } = req.query;
//         // Verify token
//         const decoded: any = jwt.verify(token as string, process.env.JWT_SECRET as string);

//         // Check if user already exists
//         const existingUser = await User.findOne({ email: decoded.email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: "Email already verified" });
//         }
//         // Create new user
//         const newUser = new User({
//             name: decoded.name,
//             email: decoded.email,
//             password: decoded.password,
//             isVerified: true, 
//         });
//         await newUser.save();
//         res.status(200).json({ success: true, message: "Email verified successfully. You can now log in." });
// };

  
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
    // if (!existingUser.isVerified) {
    //     return res.status(400).json({ success: false, message: "Please verify your email before logging in" });
    // }
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


export const logOut = async (req:Request,res:Response) =>{
    res.clearCookie("accessToken")
    res.status(200).json({success:true,message:"Logged out successfully"})      
}

interface CustomRequest extends Request {
    user?: { userId: string }; 
  }
//cr login
exports.logedUser= async (req:CustomRequest,res:Response)=>{
    const userId = req.user?.userId
    const user = await User.findById(userId).select("-password")
    if(!user){
        res.status(404).json({success:false ,message:"User not found"})
    }
    res.status(200).json({success:true,message:"User data fetched successfully",data:user})
}
  


export const editProfie = async (req:CustomRequest,res:Response)=>{
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