import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  thumbnailUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  portfolios: string[]; 
  order: number;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String, required: true }],
    thumbnailUrl: { type: String, required: true },
    githubUrl: { type: String },
    liveUrl: { type: String },
    portfolios: { 
      type: [String], 
      default: ["all"],
      enum: ["scroll-story", "minimalist", "3d-webgl", "terminal", "all"]
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);