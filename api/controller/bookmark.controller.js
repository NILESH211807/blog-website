import bookmarkModel from '../model/bookmark.model.js';
import blogModel from '../model/blog.model.js';
import { errorHandler } from '../middleware/errorMiddleware.js';

// bookmark and unbookmark blog
export const bookmarkBlog = async (req, res, next) => {
    try {

        const { blogId } = req.body;

        if (!blogId) return next(new errorHandler('Please provide blogId', 400));

        const blog = await blogModel.findById(blogId);

        if (!blog) return next(new errorHandler('Blog not found', 404));

        const bookmark = await bookmarkModel.findOne({ userId: req.user.id, blogId });

        // if already bookmarked, remove bookmark
        if (bookmark) {
            await bookmarkModel.deleteOne({ userId: req.user.id, blogId });
            return res.status(200).json({
                success: true,
                message: 'Bookmark removed successfully',
                data: {
                    id: bookmark._id,
                    blogId: bookmark.blogId,
                    userId: bookmark.userId,
                    createdAt: bookmark.createdAt,
                    updatedAt: bookmark.updatedAt,
                }
            });
        }

        // if not bookmarked, add bookmark
        const newBookmark = new bookmarkModel({
            userId: req.user.id,
            blogId,
            // author: blog.author,
        });

        await newBookmark.save();

        res.status(200).json({
            success: true,
            message: 'Bookmark added successfully',
            data: {
                id: newBookmark._id,
                blogId: newBookmark.blogId,
                userId: newBookmark.userId,
                // author: newBookmark.author,
                createdAt: newBookmark.createdAt,
                updatedAt: newBookmark.updatedAt,
            },
        });

    } catch (error) {
        next(error);
    }

}

// get all bookmarkBlog
export const getAllBookmarks = async (req, res, next) => {
    try {

        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        if (page < 1) return next(new errorHandler('Page number cannot be less than 1', 400));

        if (limit < 10) return next(new errorHandler('Limit cannot be less than 10', 400));

        if (limit > 10) return next(new errorHandler('Limit cannot be greater than 10', 400));

        const bookmarks =
            await bookmarkModel.find({ userId: req.user.id })
                .populate('blogId', 'title content tags bannerImage likes comments')
                .populate({
                    path: 'blogId',
                    populate: {
                        path: 'author',
                        select: 'name username profileImage'
                    }
                })
                .skip(skip).limit(limit).lean();

        if (!bookmarks) return next(new errorHandler('No bookmarks found', 404));

        const bookmarkData = bookmarks.map(mark => {
            return {
                id: mark._id,
                blogId: mark.blogId._id,
                title: mark.blogId.title,
                bannerImage: mark.blogId.bannerImage.url,
                likes: mark.blogId.likes.length,
                comments: mark.blogId.comments.length,
                author: {
                    id: mark.blogId.author._id,
                    name: mark.blogId.author.name,
                    username: mark.blogId.author.username,
                    profileImage: mark.blogId.author.profileImage.url,
                },
                createdAt: mark.blogId.createdAt,
                updatedAt: mark.blogId.updatedAt,
            }
        });

        res.status(200).json({
            success: true,
            data: bookmarkData,
        });


    } catch (error) {
        next(error);
    }
}
