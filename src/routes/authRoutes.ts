import express from 'express';
import {
  resetPassword,
  resetPhone,
  resetEmail,
  sendOtp,
  verifyOtp
} from '../controllers/authController';

const router = express.Router();

router.put('/reset-password', resetPassword);
router.put('/reset-phone', resetPhone);
router.put('/reset-email', resetEmail);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
