// backend/src/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// ============================================
// DEVELOPMENT MODE - NO RATE LIMITING
// ============================================
// For testing, bypass rate limiter
export const rateLimiter = (req, res, next) => {
  console.log('⏭️ Rate limiter bypassed (Development mode)');
  next();
};

export const authRateLimiter = (req, res, next) => {
  console.log('⏭️ Auth rate limiter bypassed (Development mode)');
  next();
};

// ============================================
// PRODUCTION MODE - UNCOMMENT FOR PRODUCTION
// ============================================
/*
export const rateLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
*/