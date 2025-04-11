import express, { Request, Response } from "express"
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
const app = express();
dotenv.config()
import cookieParser from "cookie-parser"
import userRouter from "./Routers/userRouter"


app.use(cors({
  origin:"http://localhost:3000",
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser())


// Routes
app.use("/api/user",userRouter)

const mongoseEnv =process.env.MONGO_URI
if(!mongoseEnv){
  throw new Error("Mongoose URI is missing!")
}
mongoose.connect(mongoseEnv)
.then(()=>{console.log("Database connected")})
.catch((err)=>{console.log(err)})

app.listen(process.env.PORT || 5001, () => {
  console.log(`🚀 Server is running on port 5001`);
});
