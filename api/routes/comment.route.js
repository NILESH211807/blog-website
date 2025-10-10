import express from 'express';
const router = express.Router();
import { createNewComment, deleteBlogComment, fetchBlogComments, likeUnlikeComment } from '../controller/comment.controller.js';


// create comment
router.post('/', createNewComment);

// fetch blog comments
router.get('/:blogId', fetchBlogComments);

// like unlike comment
router.put('/like-unlike', likeUnlikeComment);

// delete comment
router.delete('/delete-comment/:commentId', deleteBlogComment);

export default router;