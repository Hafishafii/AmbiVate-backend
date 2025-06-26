import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';





// -------------------- SEND OTP --------------------
export const sendOtpOldEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" }); return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    console.log(`🔐 Old Email OTP: ${otp}`);
    res.status(200).json({ message: "OTP sent to old email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};







// -------------------- VERIFY OTP --------------------
export const verifyOtpOldEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" }); return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" }); return;
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ message: "OTP expired" }); return;
    }

    user.isOldEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Old email verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};







export const sendOtpNewEmail = async (req: Request, res: Response): Promise<void> => {
  const { userId, newEmail } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" }); return;
    }
    if (!user.isOldEmailVerified) {
      res.status(400).json({ message: "Old email must be verified first" }); return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.newEmailTemp = newEmail;

    await user.save();
    console.log(`🔐 New Email OTP: ${otp}`);
    res.status(200).json({ message: "OTP sent to new email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};







export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, phone, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      res.status(404).json({ message: 'User not found' }); return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' }); return;
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ message: 'OTP expired' }); return;
    }

    if (!user.password) {
      res.status(400).json({ message: 'User has no password set' }); return;
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      res.status(400).json({ message: 'New password must be different from the old password' }); return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();
    res.status(200).json({ message: 'Password successfully changed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
  
  




export const resetEmail = async (req: Request, res: Response): Promise<void> => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" }); return;
    }

    if (!user.isOldEmailVerified) {
      res.status(400).json({ message: "Old email not verified" }); return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" }); return;
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ message: "OTP expired" }); return;
    }

    if (!user.newEmailTemp) {
      res.status(400).json({ message: "New email not requested" }); return;
    }

    user.email = user.newEmailTemp;
    user.newEmailTemp = undefined;
    user.isOldEmailVerified = false;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Email successfully changed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


  




export const sendOtpOldPhone = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      res.status(404).json({ message: "User not found" }); return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    console.log(`🔐 Old Phone OTP: ${otp}`);
    res.status(200).json({ message: "OTP sent to old phone" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};






export const verifyOtpOldPhone = async (req: Request, res: Response): Promise<void> => {
  const { phone, otp } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      res.status(404).json({ message: "User not found" }); return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" }); return;
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ message: "OTP expired" }); return;
    }

    user.isOldPhoneVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Old phone verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};







export const sendOtpNewPhone = async (req: Request, res: Response): Promise<void> => {
  const { userId, newPhone } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" }); return;
    }
    if (!user.isOldPhoneVerified) {
      res.status(400).json({ message: "Old phone must be verified first" }); return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.newPhoneTemp = newPhone;

    await user.save();
    console.log(`🔐 New Phone OTP: ${otp}`);
    res.status(200).json({ message: "OTP sent to new phone" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};







export const resetPhone = async (req: Request, res: Response): Promise<void> => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" }); return;
    }

    if (!user.isOldPhoneVerified) {
      res.status(400).json({ message: "Old phone not verified" }); return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" }); return;
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ message: "OTP expired" }); return;
    }

    if (!user.newPhoneTemp) {
      res.status(400).json({ message: "New phone not requested" }); return;
    }

    user.phone = user.newPhoneTemp;
    user.newPhoneTemp = undefined;
    user.isOldPhoneVerified = false;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Phone successfully changed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

  
  