import mongoose from "mongoose";

const collectionName = "User";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user"] },
    status: { type: String, required: true, enum: ["active", "inactive"] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Model = mongoose.model(collectionName, schema);

export default Model;
