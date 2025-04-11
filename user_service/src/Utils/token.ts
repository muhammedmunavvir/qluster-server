import jwt from "jsonwebtoken"
import { ObjectId } from "mongoose";

interface TokenPayload {
    userId:string|ObjectId,
    email:string,
    role:string
}
export const generateAccesstoken = (user:TokenPayload) => {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error("JWT secret key is missing! Please set JWT_SECRET in your environment variables.");
    }
    return  jwt.sign({
        userId:user.userId,
        email:user.email,
        role:user.role,
    },secretKey,{expiresIn:"24h"})
}

