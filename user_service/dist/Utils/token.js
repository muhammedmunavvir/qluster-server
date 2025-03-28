"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccesstoken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccesstoken = (user) => {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error("JWT secret key is missing! Please set JWT_SECRET in your environment variables.");
    }
    return jsonwebtoken_1.default.sign({
        userId: user._id,
        email: user.email,
        role: user.role,
    }, secretKey, { expiresIn: "24h" });
};
exports.generateAccesstoken = generateAccesstoken;
