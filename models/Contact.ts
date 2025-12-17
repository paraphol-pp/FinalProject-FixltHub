import { Schema, model, models } from "mongoose";

const ContactSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true } // createdAt, updatedAt
);

export const Contact = models.Contact || model("Contact", ContactSchema);
