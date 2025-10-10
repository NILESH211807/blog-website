import User from "../model/user.model.js";
import { errorHandler } from '../middleware/errorMiddleware.js';

// Signup Controller
export const signup = async (req, res, next) => {
    try {
        const { name, email, username, password } = req.body;

        if (!name || !email || !username || !password) {
            return next(new errorHandler('Please provide all the fields', 400));
        }

        // Normalize username (ensure it starts with @)
        const normalizedUsername = username.startsWith('@') ? username : '@' + username;

        // Check if email exists
        const emailExists = await User.findOne({ email: email.toLowerCase() });
        if (emailExists) {
            return next(new errorHandler('Email already exists', 400));
        }

        // Check if username exists
        const usernameExists = await User.findOne({
            username: normalizedUsername.toLowerCase()
        });
        if (usernameExists) return next(new errorHandler('Username already exists', 400));

        // Create new user
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            username: normalizedUsername.toLowerCase(),
            password,
        });

        await newUser.save();
        const token = await newUser.generateToken();

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
            }
        });

    } catch (error) {
        return next(error);
    }
};

// Login Controller
export const login = async (req, res, next) => {
    try {
        // login with username and password or email and password
        const { username, email, password } = req.body;

        if (!username && !email) return next(new errorHandler('Email or Username is required', 400));

        if (!password) return next(new errorHandler('Password is required', 400));

        const user = await User.findOne({ $or: [{ email }, { username }] }).select("+password");

        if (!user) return next(new errorHandler('User not found', 404));

        if (user.role === 'admin') return next(new errorHandler('Admin login is not allowed', 401));

        if (!user.active) return next(new errorHandler('Your account has been deactivated. Please contact admin.', 401));

        // Compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) return next(new errorHandler('Invalid password', 401));

        const token = await user.generateToken();

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role,
            }
        });

    } catch (error) {
        return next(error);
    }
};

// Logout Controller 
export const logout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};


