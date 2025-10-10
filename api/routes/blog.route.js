import express from 'express';
import { blogLikeUnlike, createNewStory, deleteBlog, editStory, getBlogs, searchBlog, getUserBlogs, getBlogDetailsById, popularPosts, getMyStories, getSavedBlogs, blogVisibilityChange } from '../controller/blog.controller.js';
import isAuth from '../middleware/authMiddleware.js';
import { uploadProfile } from '../middleware/upload.js';
import { limiter } from '../config/rate.limiter.js';
const router = express.Router();

// create new blog
router.post("/create-blog", isAuth, limiter, uploadProfile.single('bannerImage'), createNewStory);

// get all blogs
router.get("/get-blogs", isAuth, getBlogs);

// get all blogs created by user
router.get("/mystories", isAuth, uploadProfile.single('bannerImage'), getUserBlogs);

// edit blog
router.put("/edit-blog", isAuth, limiter, uploadProfile.single('bannerImage'), editStory);

// delete blog
router.delete("/delete-blog/:id", isAuth, deleteBlog);

// like blog
router.put("/like-unlike", isAuth, blogLikeUnlike);

// seach
router.get('/search', isAuth, searchBlog);

// get popular posts
router.get('/popular', isAuth, popularPosts);

// get my stories
router.get('/my-stories', isAuth, getMyStories);

// get all saved blogs
router.get('/saved-blogs', isAuth, getSavedBlogs);


// get blog visibility status
router.put('/visibility-change', isAuth, blogVisibilityChange);

// get blog details by id 
router.get('/:blogId', isAuth, getBlogDetailsById);


export default router;
