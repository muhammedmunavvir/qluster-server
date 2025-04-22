import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import commentRoutes from './routes/commentRoutes'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());


connectDB();

// Routes
app.use("/api/comments", commentRoutes);



app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ msg: "server error", error: err.message });
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
