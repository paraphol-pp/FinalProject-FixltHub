import { Schema, model, models } from "mongoose";

const IssueSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String },
    description: { type: String },
    category: { type: String },
    status: { type: String, default: "Pending" },
    reporter: { type: String, default: "Citizen X" },
    date: { type: String },
    imageUrl: { type: String, default: "/assets/issues/issue-1.avif" },
  },
  { timestamps: true }
);

export const Issue = models.Issue || model("Issue", IssueSchema);
