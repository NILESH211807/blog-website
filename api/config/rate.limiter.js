import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const time = req.rateLimit.resetTime - Date.now();
        const inMinute = Math.ceil(time / 1000 / 60);
         
        res.status(429).json({
            success: false,
            message: `Too many requests, please try again in ${inMinute} minutes`,
        });
    },
});


