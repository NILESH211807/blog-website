import express from 'express';
const router = express.Router();
import { signup, login, logout } from '../controller/auth.controller.js';
import { validateLogin, validateSignup } from '../validator/auth.validator.js';
import { validateRequest } from '../middleware/errorMiddleware.js';

router.post('/signup', validateSignup, validateRequest, signup);
router.post('/login', validateLogin, validateRequest, login);
router.get('/logout', logout);


export default router;
