import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  portfolioSource: string;
  isRead: boolean;
}

const MessageSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    portfolioSource: { 
      type: String, 
      default: "unknown" 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);