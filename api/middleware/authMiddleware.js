import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import asyncHandler from 'express-async-handler';

const isAuth = async (req, res, next) => {
    // Check for token in Authorization header
    const authorization = req.headers.authorization;
    let token = '';
    if (authorization && authorization?.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    // If not in header, check cookies
    if (!token) {
        token = req.cookies.token;
    }

    // Verify token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access. Please login.',
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id).select('-password -following -followers');

        // Check if user is active
        if (!user.active) {
            res.status(401);
            res.clearCookie('token');
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated. Please contact admin.',
            });
        }

        if (!user) {
            res.status(401);
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access. Please login.',
            });
        }
        req.user = user;
        next();
    } catch (error) {

        res.status(401);
        // Provide more specific error messages based on JWT error type
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.',
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.',
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access. Please login.',
            });
        }
    }
};

export default isAuth;
