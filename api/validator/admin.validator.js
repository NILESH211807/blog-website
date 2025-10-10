import { body } from 'express-validator';

// Create admin validation
export const createAdminValidator = [
    body('name')
        .optional()
        .trim()
        .customSanitizer(value => value.replace(/\s+/g, ' ')) // Remove extra spaces
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be between 3 and 30 characters')
        .matches(/^[a-zA-Z\s]+$/) // Allow spaces
        .withMessage('Name can only contain letters and spaces'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .toLowerCase()
        .trim(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .isLength({ max: 20 }).withMessage('Password cannot exceed 20 characters')
        .trim(),
];

// Login validation
export const loginAdminValidator = [
    body("email").notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
];
