import { NextFunction, Request, Response } from "express"

const jwt = require("jsonwebtoken")
interface CustomRequest extends Request {
    user?: { userId: string }; 
  }
const verifyToken = (req:CustomRequest,res:Response,next:NextFunction ):void=>{
    const {accessToken} = req.cookies
    if(!accessToken){
      res.status(401).json({success:false,message:"Token required"})
      return; 

         
    }
    jwt.verify(accessToken , process.env.JWT_SECRET,(error:any,decoded:any)=>{
        if(error){
            return res.status(403).json({success:false,message:"Invalid token or expired"})
        }
        req.user = decoded 
        // console.log(decoded);
        next()

    })
}
export default verifyToken