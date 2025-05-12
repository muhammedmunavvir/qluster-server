
import { Request, Response } from "express";
import User from "../Models/userModel";
import bcrypt from "bcryptjs";

interface CustomRequest extends Request {
  user?: { userId: string };
}

export const changePassword = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "Both fields are required" });
      return;
    }

    const user = await User.findById(userId);
    if (!user || typeof user.password !== "string") {
      res.status(400).json({ message: "User not found or password is not set" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Current password is incorrect" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
