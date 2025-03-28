"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, require: true, min: 3, unique: true },
    email: { type: String, require: true, lowercase: true },
    password: { type: String, require: true, minLength: 6 },
    profilePicture: { type: String, default: "" },
    bio: { type: String, maxlength: 300 },
    skills: [{ type: String }],
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    portfolio: { type: String },
    github: { type: String },
    linkedin: { type: String },
    projectsOwned: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Project" }], // Projects user created
    projectsContributed: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Project" }], // Projects user contributed to
    endorsements: [
        {
            skill: String,
            endorsedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
        },
    ],
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
