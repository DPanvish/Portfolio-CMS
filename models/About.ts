import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  tagline: string;
  bio: string;
  skills: string[]; 
  resumeUrl?: string; 
}

const AboutSchema: Schema = new Schema(
  {
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    skills: [{ type: String }],
    resumeUrl: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);