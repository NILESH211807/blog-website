import jwt from 'jsonwebtoken';
import adminModel from '../model/admin.model.js';

// check if admin is authenticated ============== //
export const checkIsAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({
            success: false,
            message: 'Unauthorized access. Please login.',
        });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({
            success: false,
            message: 'Unauthorized access. Please login.',
        });

        const admin = await adminModel.findById(decoded.id);

        if (!admin.active) return res.status(401).json({
            success: false,
            message: 'Your account has been deactivated. Please contact admin.',
        });

        const admins = ['admin', 'superadmin'];

        if (!admins.includes(admin.role)) return res.status(401).json({
            success: false,
            message: 'You are not authorized to access this resource.',
        });

        if (!admin) return res.status(401).json({
            success: false,
            message: 'Unauthorized access. Please login.',
        });

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access. Please login.',
        });
    }
}

// super admin access ========================== //
export const superAdminAccess = async (req, res, next) => {
    try {
        if (req.user.role !== 'superadmin') return res.status(403).json({
            success: false,
            message: 'You are not authorized to access this resource.',
        });

        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'You are not authorized to access this resource.',
        });
    }
}
