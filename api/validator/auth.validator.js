import { body } from 'express-validator';

// Signup validation
export const validateSignup = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .trim()
        .customSanitizer(value => value.replace(/\s+/g, ' '))
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be between 3 and 30 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .trim(),
    body('username')
        .notEmpty().withMessage('Username is required')
        // Add @ if not provided
        .customSanitizer(value => {
            return value?.startsWith('@') ? value : '@' + value;
        })
        // Remove extra @ symbols
        .customSanitizer(value => value.replace(/@+/g, '@'))
        .matches(/^@[a-zA-Z0-9_@]+$/).withMessage('Username can only contain letters, numbers, underscores, and @ symbol')
        .isLength({ min: 4, max: 31 }).withMessage('Username must be between 4 and 30 characters (not including @)')
        .trim(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .isLength({ max: 20 }).withMessage('Password cannot exceed 20 characters')
        .trim(),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin')
];

// Login validation
export const validateLogin = [
    body("email").optional().isEmail().withMessage('Invalid email format'),
    body("username").optional(),
    body('password').notEmpty().withMessage('Password is required')
];

// Update profile validation
export const validateUpdateProfile = [
    body('name')
        .optional()
        .trim()
        .customSanitizer(value => value.replace(/\s+/g, ' '))
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be between 3 and 30 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('username')
        .optional()
        .notEmpty().withMessage('Username is required')
        .customSanitizer(value => value?.startsWith('@') ? value : '@' + value)
        .customSanitizer(value => value.replace(/@+/g, '@'))
        .matches(/^@[a-zA-Z0-9_@]+$/).withMessage('Username can only contain letters, numbers, underscores, and @ symbol')
        .isLength({ min: 4, max: 31 }).withMessage('Username must be between 4 and 30 characters (not including @)')
        .trim(),
    body('bio').optional().trim().customSanitizer(value => value.replace(/\s+/g, ' '))
        .isLength({ min: 3, max: 250 }).withMessage('Bio must be between 3 and 250 characters')
        // .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Bio can only contain letters, numbers, and spaces')
        // Remove extra spaces
        .customSanitizer(value => value.replace(/\s+/g, ' ')),
    body('profileImage').optional().trim(),
    body('socialLinks').optional().trim()
        .customSanitizer(value => value.replace(/\s+/g, ' '))
];

// Change password validation
export const validateChangePassword = [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .isLength({ max: 20 }).withMessage('Password cannot exceed 20 characters')
        .trim(),
];
