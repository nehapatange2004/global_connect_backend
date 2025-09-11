import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const SavedJob = mongoose.model("SavedJob", savedJobSchema);
export default SavedJob;