import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  role: string;
  company: string;
  period: string;
  description: string;
  portfolios: string[];
  order: number;
}

const ExperienceSchema: Schema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
    portfolios: { 
      type: [String], 
      default: ["all"],
      enum: ["scroll-story", "minimalist", "3d-webgl", "terminal", "all"]
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);