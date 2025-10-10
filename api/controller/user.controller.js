import User from '../model/user.model.js';
import { profile_image_upload } from '../utils/uploadImage.js';
import { deleteFilesFromCloudinary } from '../utils/uploadImage.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import blogModel from '../model/blog.model.js';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

// senetize search query 
const sanitizeQuery = (query) => {
    if (typeof query !== 'string') return '';
    return query
        .trim()
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z0-9@.]/g, '')
        .toLowerCase();
}

const sanitizeUsername = (username) => {
    if (typeof username !== 'string') return '';

    if (!username.startsWith('@')) {
        username = '@' + username;
    }

    return username
        .trim()
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z0-9@._]/g, '')
        .toLowerCase();
}

// Get user profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).lean();

        if (!user) return next(new errorHandler('User not found', 404));

        let userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            role: user.role,
            following: user.following.length,
            followers: user.followers.length,
            // bookmarks: user.bookmarks,
        };

        if (user.profileImage?.url) {
            userData.profileImage = user.profileImage.url;
        }

        if (user.socialLinks) {
            userData.socialLinks = user.socialLinks;
        }

        res.status(200).json({
            success: true,
            data: userData,
        });

    } catch (error) {
        return next(error);
    }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
    try {
        let { name, username, bio, socialLinks } = req.body;

        if (!name && !username && !bio && !socialLinks) {
            return next(new errorHandler('Please provide at least one field to update', 400));
        }

        const user = await User.findById(req.user.id);

        if (!user) return next(new errorHandler('User not found', 404));

        if (name) {
            user.name = name;
        }

        if (username) {
            if (!username.startsWith('@')) {
                username = '@' + username;
            }
            user.username = username;
        }

        if (bio) {
            user.bio = bio;
        }

        if (socialLinks) {
            // Check if socialLinks is a string and parse it if needed
            if (typeof socialLinks === 'string') {
                try {
                    socialLinks = JSON.parse(socialLinks);
                } catch (error) {
                    return next(new errorHandler('Invalid social links format', 400));
                }
            }
            user.socialLinks = socialLinks;
        }

        if (!user.isModified()) return next(new errorHandler('No changes made', 400));

        await user.save();

        let userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            role: user.role,
            following: user.following.length,
            followers: user.followers.length,
        };

        if (user.profileImage?.url) {
            userData.profileImage = user.profileImage.url;
        }

        if (user.socialLinks) {
            userData.socialLinks = user.socialLinks;
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: userData
        });

    } catch (error) {
        return next(error);
    }
};

// upload profile image
export const uploadProfileImage = async (req, res, next) => {

    try {

        const file = req.file;

        if (!file) return next(new errorHandler('Please provide a file', 400));

        const user = await User.findById(req.user.id);

        if (!user) return next(new errorHandler('User not found', 404));

        // check already any profile image uploaded
        if (user?.profileImage?.public_id) {
            await deleteFilesFromCloudinary(user.profileImage.public_id);
        }

        const uploadResult = await profile_image_upload(file);

        if (!uploadResult) return next(new errorHandler('Failed to upload image', 500));

        user.profileImage = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile image uploaded successfully',
            data: user.profileImage,
        });

    } catch (error) {
        return next(error);
    }
}

// change password
export const changePassword = async (req, res, next) => {
    try {

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return next(new errorHandler('Please provide old and new password', 400));
        }

        if (oldPassword == newPassword) return next(new errorHandler('Old and new password cannot be same', 400));

        const user = await User.findById(req.user.id).select('+password');

        if (!user) return next(new errorHandler('User not found', 404));

        const isMatch = await user.comparePassword(oldPassword);

        if (!isMatch) return next(new errorHandler('Old password is incorrect', 401));

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });

    } catch (error) {
        return next(error);
    }
};

// follow and unfollow
export const followUnfollow = async (req, res, next) => {
    try {

        const { userId } = req.body;

        if (!userId) return next(new errorHandler('Please provide userid', 400));

        if (userId === req.user.id) return next(new errorHandler('You cannot follow yourself', 400));

        const user = await User.findById(userId);

        if (!user) return next(new errorHandler('Invalid userid', 404));

        const loggedInUser = await User.findById(req.user.id);

        if (!loggedInUser) return next(new errorHandler('Unauthorized access. Please login.', 404));

        let msg = '';

        // check if already following
        if (loggedInUser.following.includes(userId)) {
            loggedInUser.following = loggedInUser.following.filter(following => following.toString() !== userId);
            user.followers = user.followers.filter(follower => follower.toString() !== req.user.id);
            msg = 'Unfollowed successfully';
        } else {
            loggedInUser.following.push(userId);
            user.followers.push(req.user.id);
            msg = 'Followed successfully';
        }

        await loggedInUser.save();
        await user.save();

        res.status(200).json({
            success: true,
            message: msg,
            data: {
                following: loggedInUser.following.length,
                isFollowing: loggedInUser.following.includes(userId),
                name: user.name,
                username: user.username,
            },
        });

    } catch (error) {
        return next(error);
    }
};

// search user
export const searchUser = async (req, res, next) => {
    try {

        const query = sanitizeQuery(req.query.query);

        if (!query) return next(new errorHandler('Please provide search query', 400));

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (page < 1) return next(new errorHandler('Page number cannot be less than 1', 400));
        if (limit < 3) return next(new errorHandler('Limit cannot be less than 3', 400));
        if (limit > 10) return next(new errorHandler('Limit cannot be greater than 10', 400));

        const users = await User.find({
            _id: { $ne: req.user.id },
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).skip(skip).limit(limit).lean();

        if (!users) return next(new errorHandler('No users found', 404));

        const updated = users.map((user) => {
            return {
                id: user._id,
                name: user.name,
                username: user.username,
                profileImage: user?.profileImage?.url,
                bio: user.bio,
                isFollowing: user.followers.some(f => f.toString() === req.user.id.toString()),
            }
        })

        res.status(200).json({
            success: true,
            data: updated,
        })

    } catch (error) {
        return next(error);
    }
}

// get user details by username
export const getUserDetailsByUsername = async (req, res, next) => {
    try {

        const sanitizedUsername = sanitizeUsername(req.params.username);

        if (!sanitizedUsername) return next(new errorHandler('Please provide username', 400));

        const user = await User.findOne({ username: sanitizedUsername }).lean();

        if (!user) return next(new errorHandler('User not found', 404));

        let userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            role: user.role,
            following: user.following?.length,
            followers: user.followers?.length,
            isFollowing: user.followers.some(followerId =>
                followerId.equals(new ObjectId(req.user.id))
            ),
        };

        if (user.profileImage?.url) {
            userData.profileImage = user.profileImage.url;
        }

        if (user.socialLinks) {
            userData.socialLinks = user.socialLinks;
        }

        res.status(200).json({
            success: true,
            data: userData,
        });

    } catch (error) {
        return next(error);
    }
}

// get user blog by username
export const getUserBlogByUsername = async (req, res, next) => {
    try {

        const sanitizedUsername = sanitizeUsername(req.params.username);

        if (!sanitizedUsername) return next(new errorHandler('Please provide username', 400));

        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const user = await User.findOne({ username: sanitizedUsername }).lean();

        if (!user) return next(new errorHandler('User not found', 404));

        const blogs = await blogModel.find({ author: user._id })
            .populate('author', 'name username profileImage')
            .lean()
            .skip(skip)
            .limit(limit)
            .lean()
            .sort({ createdAt: -1 });

        if (!blogs) return next(new errorHandler('No blogs found', 404));

        const updated = blogs.map((blog) => {
            return {
                id: blog._id,
                title: blog.title,
                bannerImage: blog?.bannerImage?.url,
                author: {
                    id: blog.author._id,
                    name: blog.author.name,
                    username: blog.author.username,
                    profileImage: blog?.author?.profileImage?.url,
                },
                createdAt: blog.createdAt,
            }
        });

        res.status(200).json({
            success: true,
            data: updated,
        });

    } catch (error) {
        return next(error);
    }
}


