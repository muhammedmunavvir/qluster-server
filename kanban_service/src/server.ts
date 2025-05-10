import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoute from './routes/taskRoute'
import { connectDB } from "./config/db";
import boardRoute from './routes/boardRoute'
import columnRoute from './routes/column.Route'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());


connectDB();

// Routes
app.use("/api/task", taskRoute);
app.use('/api/board',boardRoute);
app.use('/api/column',columnRoute);



app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ msg: "server error", error: err.message });
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
