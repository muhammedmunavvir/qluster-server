import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

export const connectDB = async () :Promise<void> =>{
  try
  {
  await mongoose.connect(process.env.MONGO_URI as string) ;
  console.log("MongoDB connected succesfully of task..")
}catch(error){
  console.log("mongoDB connection failed..",(error as Error).message)
  process.exit(1);

}
}