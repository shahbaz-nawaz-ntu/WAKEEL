// backend/src/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// ✅ ALLOWED EMAILS - Sirf yeh 3 emails register kar sakte hain
const ALLOWED_EMAILS = [
  'aqsasaher5995@gmail.com',
  'hr.callbackcrew@gmail.com',
  'admin@jurisflow.com'
];

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, company } = req.body;

    // ✅ CHECK: Sirf allowed emails register kar sakte hain
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({
        success: false,
        error: 'Registration is currently restricted. Only authorized emails can register.',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'attorney',
      phone: phone || '',
      company: company || '',
    });

    const token = generateToken(user._id);

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
      },
    });
  } catch (error) {
    logger.error(`Register error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact support.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        avatar: user.avatar,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const { name, phone, company, avatar, address, role } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (company) user.company = company;
    if (address) user.address = address;
    if (role) user.role = role;
    if (avatar) user.avatar = avatar;
    user.updatedAt = Date.now();

    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        address: user.address,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    user.updatedAt = Date.now();
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// FORGOT PASSWORD
// ============================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email address',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No user found with this email',
      });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`🔑 Reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
      resetToken,
    });
  } catch (error) {
    logger.error(`Forgot password error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide token and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    user.password = newPassword;
    user.updatedAt = Date.now();
    await user.save();

    logger.info(`Password reset for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    logger.error(`Reset password error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// SOCIAL LOGIN
// ============================================
export const socialLoginSuccess = async (req, res) => {
  try {
    console.log('🔍 socialLoginSuccess called');
    console.log('🔍 req.user:', req.user);

    if (!req.user) {
      console.log('❌ No user found');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=Social login failed`);
    }

    const user = req.user;
    const token = generateToken(user._id);

    user.lastLogin = Date.now();
    await user.save();

    console.log(`✅ Social login success: ${user.email} via ${user.authProvider}`);

    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      authProvider: user.authProvider,
    }))}`;

    console.log('🔍 Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ Social login success error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=Social login failed`);
  }
};

export const socialLoginFailure = (req, res) => {
  console.warn('Social login failed');
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=Social login failed`);
};