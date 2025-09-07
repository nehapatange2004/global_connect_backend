import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    experience: [
      {
        company: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        from: { type: Date, required: true }, // start date
        to: { type: Date }, // null if still working
      },
    ],
    education: [
      {
        school: { type: String, required: true, trim: true },
        degree: { type: String, trim: true },
        from: { type: Date, required: true },
        to: { type: Date },
      },
    ],
    skills: {
      type: [String],
      default: [],
    },
    connections: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    connectionRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    savedJobs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Job" }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
