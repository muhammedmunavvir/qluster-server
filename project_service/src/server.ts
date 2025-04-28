import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRouter from "./routes/projectRoutes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin:"http://localhost:3000",
  credentials :true
})); 
app.use(express.json());

// Routes
app.use("/api/project",projectRouter );


connectDB();
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ msg: "server error", error: err.message });
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
