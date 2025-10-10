import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import helmet from "helmet";
import cors from "cors";

import authRoute from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import blogRoutes from './routes/blog.route.js';
import commentRoutes from './routes/comment.route.js';
import bookmarkRoutes from './routes/bookmark.route.js';
import adminRoutes from './routes/admin.route.js';

import isAuth from './middleware/authMiddleware.js';

import { errorMiddleware } from './middleware/errorMiddleware.js';
import { limiter } from "./config/rate.limiter.js";

// import { createBlog, createUser } from './seeders/all.js';


// createUser(1)
// createBlog(30);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_URI,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.set('trust proxy', 1); // Trust the first proxy (like Render)

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));

//database connection
connectDB();
//Routes
app.use("/api/auth", limiter, authRoute);
app.use("/api/user", isAuth, userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/comment", isAuth, commentRoutes);
app.use("/api/bookmark", isAuth, bookmarkRoutes);

// admin
app.use("/api/admin", adminRoutes);


app.get('/', (req, res) => {
    res.send("Hello..!");
});

// Error handling middleware
app.use(errorMiddleware);



app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});

