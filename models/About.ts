import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  tagline: string;
  bio: string;
  skills: string[]; 
  resumeUrl?: string; 
  portfolios: string[];
}

const AboutSchema: Schema = new Schema(
  {
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    skills: [{ type: String }],
    resumeUrl: { type: String },
    portfolios: { 
      type: [String], 
      default: ["all"],
      enum: ["scroll-story", "minimalist", "3d-webgl", "terminal", "all"]
    }
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);