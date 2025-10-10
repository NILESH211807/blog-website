import commentModel from '../model/comment.model.js';
import blogModel from '../model/blog.model.js';
import { errorHandler } from "../middleware/errorMiddleware.js";

// create comment
export const createNewComment = async (req, res, next) => {
    try {

        const { blogId, content } = req.body;

        if (!blogId || !content) {
            return next(new errorHandler('Please provide blog id and content', 400));
        };

        const blog = await blogModel.findById(blogId);

        if (!blog) return next(new errorHandler('Blog not found', 404));

        const newComment = new commentModel({
            blogId,
            userId: req.user.id,
            content,
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: {
                id: newComment._id,
                content: newComment.content,
                author: newComment.userId,
                likes: newComment.likes.length,
                createdAt: newComment.createdAt,
                updatedAt: newComment.updatedAt,
            },
        });

    } catch (error) {
        next(error);
    }
}

// fetch blog comments
export const fetchBlogComments = async (req, res, next) => {
    try {

        const { blogId } = req.params;

        if (!blogId) return next(new errorHandler('Please provide blogId', 400));

        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        if (page < 1) return next(new errorHandler('Page number cannot be less than 1', 400));

        if (limit < 5) return next(new errorHandler('Limit cannot be less than 5', 400));

        if (limit > 10) return next(new errorHandler('Limit cannot be greater than 10', 400));

        const blog = await blogModel.findById(blogId);

        if (!blog) return next(new errorHandler('Blog not found', 404));

        const comments = await commentModel.find({ blogId })
            .populate('userId', 'name username profileImage')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        if (!comments) return next(new errorHandler('No comments found', 404));

        const formattedComments = comments.map(comment => {
            const { userId, likes, ...rest } = comment;

            return {
                ...rest,
                likes: likes.length,
                isLiked: likes.some(like => like.toString() === req.user.id),
                author: {
                    id: userId._id,
                    name: userId.name,
                    username: userId.username,
                    profileImage: userId?.profileImage?.url,
                }
            };
        });

        res.status(200).json({
            success: true,
            data: formattedComments
        });

    } catch (error) {
        next(error);
    }
}

// like unlike comment
export const likeUnlikeComment = async (req, res, next) => {
    try {

        const { commentId } = req.body;

        if (!commentId) return next(new errorHandler('Please provide comment id', 400));

        const comment = await commentModel.findById(commentId);

        if (!comment) return next(new errorHandler('Comment not found', 404));

        let msg = '';

        if (comment.likes.includes(req.user.id)) {
            comment.likes = comment.likes.filter(like => like.toString() !== req.user.id);
            msg = 'Comment unliked successfully';
        } else {
            comment.likes.push(req.user.id);
            msg = 'Comment liked successfully';
        }

        await comment.save();

        res.status(200).json({
            success: true,
            message: msg,
            data: {
                commentId: comment._id,
                likes: comment.likes.length,
                isLiked: comment.likes.map(like => like.toString()).includes(req.user.id),
                name: req.user.name,
                username: req.user.username,
            },
        });


    } catch (error) {
        next(error);
    }
}

// delete comment
export const deleteBlogComment = async (req, res, next) => {
    try {

        const { commentId } = req.params;

        if (!commentId) return next(new errorHandler('Please provide commentId', 400));

        const comment = await commentModel.findById(commentId);

        if (!comment) return next(new errorHandler('Comment not found', 404));

        if (comment.userId.toString() !== req.user.id) {
            return next(new errorHandler('You are not authorized to delete this comment', 401));
        }

        await commentModel.deleteOne({ _id: commentId });

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            data: {
                id: comment._id,
            },
        });

    } catch (error) {
        next(error);
    }
}