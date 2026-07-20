// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ✅ Authenticate Token Middleware (for protected routes)
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('⚠️ No token provided');
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required. Please login.' 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Token received:', token.substring(0, 20) + '...');

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'jurisflow_jwt_secret_2024';
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified for user:', decoded.id);

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('⚠️ User not found');
      return res.status(401).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expired' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication error' 
    });
  }
};

// ✅ Protect Middleware (alias for authenticateToken - used in authRoutes)
export const protect = authenticateToken;

// ✅ Ensure Authenticated (for OAuth routes)
export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    success: false, 
    error: 'Not authenticated' 
  });
};

// ✅ Default export for backward compatibility
export default {
  authenticateToken,
  protect,
  ensureAuthenticated
};