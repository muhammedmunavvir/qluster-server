import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import channelRouter from "./Routers/channelRouter"
import "../src/Consumers/projectDataConsumer"  //note
import "../src/Consumers/userDataConsumer"
import cookieParser from "cookie-parser"
import http from "http"
const app =express()
const server = http.createServer(app);
import { Server as SocketIOServer } from "socket.io";
import { channelSocket } from "./Sockets/channelSocket"
import peerChatSocket from "./Sockets/peerChatSocket"


const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials:true
  }
});
app.use(express.json());
app.use(cookieParser())
app.use(cors({origin:"http://localhost:3000", credentials:true, }))

app.use("/api/channel",channelRouter)

channelSocket(io)
peerChatSocket(io)

const mongoseEnv =process.env.MONGO_URI
if(!mongoseEnv){throw new Error("Mongoose URI is missing!")}
mongoose.connect(mongoseEnv)
.then(()=>{console.log("Database connected")})
.catch((err)=>{console.log(err)})


server.listen(process.env.PORT||5004,()=>{
    console.log(`🚀 Server is running on port 5004`);
    
})