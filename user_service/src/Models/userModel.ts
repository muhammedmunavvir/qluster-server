import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,require:true,min:3,unique:true},
    email:{type:String,require:true,lowercase:true},
    password:{type:String,require:true,minLength:6},
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

},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User