import express from 'express';
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authMiddleware, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, getMe);

export default router;
