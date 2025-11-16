import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true, // from Clerk
    },
    title: {
      type: String,
      default: "My Resume",
    },
    resumeData: {
      type: Object, // your entire resumeTemplate JSON
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
