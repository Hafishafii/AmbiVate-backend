import mongoose, { Model, Schema } from "mongoose";
import { UserSchemaType } from "../models/schema";

const usersSchema: Schema<UserSchemaType> = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isOldEmailVerified: {
      type: Boolean,
      default: false,
    },
    isOldPhoneVerified: {
      type: Boolean,
      default: false,
    },
    newEmailTemp: {
      type: String,
      sparse: true,
    },
    newPhoneTemp: {
      type: String,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["Credentials", "Google"],
      default: "Credentials",
    },
    password_reset_token: {
      type: String,
    },
    password_reset_expires: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["JobSeeker", "Employer"],
      default: null,
    },
  },
  { timestamps: true }
);

const Users: Model<UserSchemaType> =
  mongoose.models.Users || mongoose.model<UserSchemaType>("Users", usersSchema);

export default Users;
