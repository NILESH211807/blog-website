import { body } from 'express-validator';

export const createBlogValidator = [
    body('title').notEmpty().withMessage('Title is required')
        .trim()
        .customSanitizer(value => value.replace(/\s+/g, ' '))
        .isLength({ min: 5, max: 300 }).withMessage('Title must be between 5 and 300 characters'),
    body('content').notEmpty().withMessage('Content is required'),
    body('tags')
        .optional()
        .customSanitizer(value => {
            try {
                return typeof value === 'string' ? JSON.parse(value) : value;
            } catch (e) {
                return value;
            }
        })
        .isArray().withMessage('Tags must be an array of strings')
        .custom((value) => {
            if (value.length <= 0) {
                throw new Error('Please select at least one topic');
            }
            if (value.length > 5) {
                throw new Error('You can select up to 5 topics only');
            }
            return true;
        }),
];
