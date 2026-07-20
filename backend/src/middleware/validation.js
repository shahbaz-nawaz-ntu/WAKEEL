import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// ============================================
// CASE VALIDATIONS
// ============================================

export const validateCase = [
  body('caseTitle')
    .trim()
    .notEmpty()
    .withMessage('Case title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Case title must be between 3 and 200 characters'),
  
  body('caseNumber')
    .optional()
    .trim(),
  
  body('status')
    .optional()
    .isIn(['active', 'pending', 'closed'])
    .withMessage('Invalid status value'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent'])
    .withMessage('Invalid priority value'),
  
  body('caseType')
    .optional()
    .isIn(['civil', 'criminal', 'labour', 'service', 'tax', 'family'])
    .withMessage('Invalid case type'),
  
  body('amount')
    .optional()
    .trim(),
];

// ============================================
// CLIENT VALIDATIONS
// ============================================

export const validateClient = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Client name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please add a valid email'),
  
  body('phone')
    .optional()
    .trim(),
  
  body('status')
    .optional()
    .isIn(['active', 'pending', 'inactive'])
    .withMessage('Invalid status value'),
];

// ============================================
// EVENT VALIDATIONS
// ============================================

export const validateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required'),
  
  body('date')
    .notEmpty()
    .withMessage('Date is required'),
  
  body('time')
    .notEmpty()
    .withMessage('Time is required'),
  
  body('type')
    .optional()
    .isIn(['hearing', 'meeting', 'deposition', 'conference'])
    .withMessage('Invalid event type'),
];

// ============================================
// AUTH VALIDATIONS
// ============================================

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please add a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please add a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];