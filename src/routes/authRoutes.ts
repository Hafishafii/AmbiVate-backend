import express from "express";
import {
  sendOtpOldEmail,
  verifyOtpOldEmail,
  sendOtpNewEmail,
  resetEmail,
  sendOtpOldPhone,
  verifyOtpOldPhone,
  sendOtpNewPhone,
  resetPhone,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();


router.post("/send-otp-old-email", sendOtpOldEmail);
router.post("/verify-otp-old-email", verifyOtpOldEmail);
router.post("/send-otp-new-email", sendOtpNewEmail);
router.put("/reset-email", resetEmail);


router.post("/send-otp-old-phone", sendOtpOldPhone);
router.post("/verify-otp-old-phone", verifyOtpOldPhone);
router.post("/send-otp-new-phone", sendOtpNewPhone);
router.put("/reset-phone", resetPhone);


router.put("/reset-password", resetPassword);


export default router;