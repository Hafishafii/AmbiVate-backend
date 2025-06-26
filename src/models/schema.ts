import mongoose from "mongoose";

export interface UserSchemaType extends mongoose.Document {
  name?: string;
  email?: string;
  phone?: string;
  password: string;

  otp?: string;
  otpExpires?: Date;

  isOldEmailVerified?: boolean;
  isOldPhoneVerified?: boolean;

  newEmailTemp?: string;
  newPhoneTemp?: string;

  provider?: "Credentials" | "Google";
  password_reset_token?: string;
  password_reset_expires?: Date;
  role?: "JobSeeker" | "Employer" | null;
}
