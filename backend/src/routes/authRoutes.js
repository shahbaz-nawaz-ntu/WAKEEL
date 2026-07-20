// backend/src/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  socialLoginSuccess,
  socialLoginFailure,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin, validate } from '../middleware/validation.js';

const router = express.Router();

console.log('🔐 Setting up auth routes with Passport...');

// ============================================
// LOCAL AUTH
// ============================================
router.post('/register', validateRegister, validate, register);
router.post('/login', validateLogin, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// ============================================
// FORGOT PASSWORD
// ============================================
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ============================================
// GOOGLE AUTH
// ============================================
router.get(
  '/google',
  (req, res, next) => {
    console.log('🔑 Google auth route hit!');
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('🔄 Google callback received!');
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/api/auth/failure',
    session: false,
  }),
  socialLoginSuccess  // ✅ Using the controller function
);

// ============================================
// GITHUB AUTH
// ============================================
router.get(
  '/github',
  (req, res, next) => {
    console.log('🔑 GitHub auth route hit!');
    next();
  },
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  (req, res, next) => {
    console.log('🔄 GitHub callback received!');
    next();
  },
  passport.authenticate('github', {
    failureRedirect: '/api/auth/failure',
    session: false,
  }),
  socialLoginSuccess  // ✅ Using the controller function
);

// ============================================
// AUTH FAILURE
// ============================================
router.get('/failure', socialLoginFailure);

export default router;