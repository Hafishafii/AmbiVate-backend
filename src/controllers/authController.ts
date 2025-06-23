import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';





// -------------------- SEND OTP --------------------
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, phone } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); 

    user.otp = otp;
    user.otpExpires = expiry;
    await user.save();

    console.log(`🔐 OTP for ${email || phone}: ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};






// -------------------- VERIFY OTP --------------------
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, phone, otp } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ message: 'OTP expired' });
      return;
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};





// -------------------- RESET PASSWORD --------------------
// export const resetPassword = async (req: Request, res: Response): Promise<void> => {
//   const { email, phone, otp, newPassword } = req.body;

//   try {
//     const user = await User.findOne({ $or: [{ email }, { phone }] });
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }

//     if (user.otp !== otp) {
//       res.status(400).json({ message: 'Invalid OTP' });
//       return;
//     }

//     if (!user.otpExpires || user.otpExpires < new Date()) {
//       res.status(400).json({ message: 'OTP expired' });
//       return;
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     res.status(200).json({ message: 'Password successfully changed' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// };






export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, phone, otp, newPassword } = req.body;
    try {
      const user = await User.findOne({ $or: [{ email }, { phone }] });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      if (user.otp !== otp) {
        res.status(400).json({ message: 'Invalid OTP' });
        return;
      }

      if (!user.otpExpires || user.otpExpires < new Date()) {
        res.status(400).json({ message: 'OTP expired' });
        return;
      }

      if (!user.password) {
        res.status(400).json({ message: 'User has no password set' });
        return;
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        res.status(400).json({ message: 'New password must be different from the old password' });
        return;
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
    const { email, phone, otp, newEmail } = req.body;
  
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
  
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser && (existingUser as any)._id.toString() !== (user as any)._id.toString()) {
        res.status(400).json({ message: 'Email is already in use' }); return;
      }
  
      user.email = newEmail;
      user.otp = undefined;
      user.otpExpires = undefined;
  
      await user.save();
      res.status(200).json({ message: 'Email successfully changed' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
};
  




  export const resetPhone = async (req: Request, res: Response): Promise<void> => {
    const { email, phone, otp, newPhone } = req.body;
  
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
  
      const existingUser = await User.findOne({ phone: newPhone });
      if (existingUser && (existingUser as any)._id.toString() !== (user as any)._id.toString()) {
        res.status(400).json({ message: 'Phone number is already in use' }); return;
      }
  
      user.phone = newPhone;
      user.otp = undefined;
      user.otpExpires = undefined;
  
      await user.save();
      res.status(200).json({ message: 'Phone successfully changed' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
};
  
  