import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import channelRouter from "./Routers/channelRouter"
import "../src/Consumers/projectDataConsumer"
import cookieParser from "cookie-parser"


const app =express()
app.use(cors({
    origin:"http://localhost:3000",
  credentials:true,
}))
app.use(express.json());
app.use(cookieParser())

app.use("/api/channel",channelRouter)

const mongoseEnv =process.env.MONGO_URI
if(!mongoseEnv){throw new Error("Mongoose URI is missing!")}
mongoose.connect(mongoseEnv)
.then(()=>{console.log("Database connected")})
.catch((err)=>{console.log(err)})


app.listen(process.env.PORT||5024,()=>{
    console.log(`🚀 Server is running on port 5004`);
    
})