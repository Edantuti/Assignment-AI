import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: "to-do" | "progress" | "completed";
  priority: "low" | "medium" | "hard";
  due_date: Date;
  userId: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const taskSchema: Schema<ITask> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["to-do", "progress", "completed"],
    default: "to-do",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  due_date: { type: Date, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

taskSchema.pre<ITask>("save", function (next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<ITask>("Task", taskSchema);
