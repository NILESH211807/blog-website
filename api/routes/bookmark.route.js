import express from 'express';
const router = express.Router();

import { bookmarkBlog, getAllBookmarks } from '../controller/bookmark.controller.js';

// bookmark and unbookmark blog
router.put('/add-remove', bookmarkBlog);

// get all bookmarkBlog
router.get('/', getAllBookmarks);

export default router;