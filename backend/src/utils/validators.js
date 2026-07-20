import { body } from 'express-validator';

// Register Validation
export const registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'attorney', 'paralegal', 'client']).withMessage('Invalid role'),
];

// Login Validation
export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Case Validation
export const caseValidation = [
  body('title')
    .notEmpty().withMessage('Case title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('status')
    .optional()
    .isIn(['active', 'pending', 'closed']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority'),
  body('caseType')
    .optional()
    .isIn(['Civil', 'Criminal', 'Family', 'Corporate', 'Civil Rights', 'Personal Injury']).withMessage('Invalid case type'),
];

// Client Validation
export const clientValidation = [
  body('name')
    .notEmpty().withMessage('Client name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('status')
    .optional()
    .isIn(['active', 'pending', 'inactive']).withMessage('Invalid status'),
];

// Event Validation
export const eventValidation = [
  body('title')
    .notEmpty().withMessage('Event title is required'),
  body('date')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('time')
    .notEmpty().withMessage('Event time is required'),
  body('type')
    .optional()
    .isIn(['hearing', 'meeting', 'deposition', 'conference', 'other']).withMessage('Invalid event type'),
];