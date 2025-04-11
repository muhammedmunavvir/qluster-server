import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,require:true,min:3},
    email:{type:String,require:true,lowercase:true},
    password:{type:String,require:false},
    profilePicture: { type: String, default: "" },
    converImage:{ type: String, default: "" },
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
    projectsOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], // Projects user created
    projectsContributed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], // Projects user contributed to
    endorsements: [
        {
          skill: String,
          endorsedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
    isVerified: { type: Boolean, default: false }, // New field


},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User