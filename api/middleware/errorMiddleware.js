import { validationResult } from 'express-validator';

const errorMiddleware = (error, req, res, next) => {
    const message = error.message || 'Internal Server Error';
    const statusCode = error.statusCode || 500;
    const success = false;

    if (error.name == "CastError" && error.kind == "ObjectId") {
        return res.status(400).json({
            success,
            message: 'Invalid ID',
        });
    }

    if (req.method !== 'GET' && req.method !== 'DELETE' && req.body == undefined) {
        return res.status(400).json({
            success,
            message: 'Please provide valid data',
        });
    }

    return res.status(statusCode).json({
        success,
        message,
    });
};


// error status
class errorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}


// express validator middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
        });
    }
    return next();
};


export { errorMiddleware, validateRequest, errorHandler };
