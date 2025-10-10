import express from "express";
const router = express.Router();
import { changePassword, followUnfollow, getProfile, getUserBlogByUsername, getUserDetailsByUsername, searchUser, updateProfile, uploadProfileImage } from '../controller/user.controller.js';
import { validateRequest } from "../middleware/errorMiddleware.js";
import { validateChangePassword, validateUpdateProfile } from "../validator/auth.validator.js";
import { uploadProfile } from "../middleware/upload.js";
import { limiter } from "../config/rate.limiter.js";

// get profile data 
router.get('/', getProfile);

// update profile 
router.put('/update-profile',
    limiter,
    validateUpdateProfile, validateRequest, updateProfile);

router.post("/upload-profile", limiter, uploadProfile.single('profile_image'), uploadProfileImage);

// change password
router.put('/change-password',
    limiter,
    validateChangePassword,
    validateRequest, changePassword);

// follow and unfollow
router.put('/follow-unfollow', followUnfollow);
// searchUser
router.get('/search', searchUser);

// getUserDetailsByUsername
router.get('/:username', getUserDetailsByUsername);

// getUserBlogByUsername
router.get('/blogs/:username', getUserBlogByUsername);

export default router;

