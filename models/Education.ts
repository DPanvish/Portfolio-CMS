import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  degree: string;
  institution: string;
  period: string;
  details: string[];
  portfolios: string[];
  order: number;
}

const EducationSchema: Schema = new Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    period: { type: String, required: true },
    details: [{ type: String }],
    portfolios: { 
      type: [String], 
      default: ["all"],
      enum: ["scroll-story", "minimalist", "3d-webgl", "terminal", "all"]
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Education || mongoose.model("Education", EducationSchema);