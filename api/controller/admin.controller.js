import adminModel from '../model/admin.model.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import User from '../model/user.model.js';
import blogModel from '../model/blog.model.js';
import commentModel from '../model/comment.model.js';
import { blog_image_upload, deleteFilesFromCloudinary, profile_image_upload } from '../utils/uploadImage.js';


// senetize search query 
const sanitizeQuery = (query) => {
    if (typeof query !== 'string') return '';
    return query
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .toLowerCase();
}
// create admin ============================== //
export const createAdmin = async (req, res, next) => {
    try {

        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return next(new errorHandler('Please provide all the fields', 400));
        }

        if (role && role !== 'admin' && role !== 'superadmin') {
            return next(new errorHandler('Invalid role', 400));
        }

        const admin = await adminModel.findOne({ email });
        if (admin) return next(new errorHandler('Admin already exists', 400));

        const newAdmin = new adminModel({
            email,
            password,
            role,
        });

        // check if name is provided
        if (name) newAdmin.name = name;

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });

    } catch (error) {
        next(error);
    }
}

// login admin ============================== //
export const loginAdmin = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return next(new errorHandler('Please provide all the fields', 400));
        }

        const admin = await adminModel.findOne({ email }).select('+password');

        if (!admin) return next(new errorHandler('Admin not found', 404));

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) return next(new errorHandler('Invalid password', 401));

        const token = await admin.generateToken();

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            }
        });

    } catch (error) {
        next(error);
    }
}

// logout admin ============================== //
export const logoutAdmin = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
}

// get admin profile ================ //
export const getAdminProfile = async (req, res, next) => {
    try {
        const admin = await adminModel.findById(req.user.id).lean();

        if (!admin) return next(new errorHandler('Admin not found', 404));

        res.status(200).json({
            success: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                profileImage: admin?.profileImage?.url,
            },
        });

    } catch (error) {
        next(error);
    }
}

// update admin profile ================ //
export const updateAdminProfile = async (req, res, next) => {
    try {

        const { name } = req.body;

        if (!name)
            return next(new errorHandler('Please provide at least one field to update', 400));

        const admin = await adminModel.findById(req.user.id);

        if (!admin) return next(new errorHandler('Admin not found', 404));

        if (name) admin.name = name;

        if (!admin.isModified()) return next(new errorHandler('No changes made', 400));

        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                profileImage: admin?.profileImage?.url,
            },
        });

    } catch (error) {
        next(error);
    }
}

// update admin profile image ================ //
export const updateAdminProfileImage = async (req, res, next) => {
    try {

        const file = req.file;

        if (!file) return next(new errorHandler('Please provide a file', 400));

        const admin = await adminModel.findById(req.user.id);

        if (!admin) return next(new errorHandler('Admin not found', 404));

        // check already any profile image uploaded
        if (admin?.profileImage?.public_id) {
            await deleteFilesFromCloudinary(admin.profileImage.public_id);
        }

        const uploadResult = await profile_image_upload(file);

        admin.profileImage = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };

        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Profile image uploaded successfully',
            data: {
                imageUrl: admin.profileImage.url,
            },
        });

    } catch (error) {
        next(error);
    }
}

// change admin password ================ //
export const changeAdminPassword = async (req, res, next) => {
    try {

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword)
            return next(new errorHandler('Please provide all the fields', 400));

        if (currentPassword === newPassword)
            return next(new errorHandler('New password cannot be same as current password', 400));

        const admin = await adminModel.findById(req.user.id).select('+password');

        if (!admin) return next(new errorHandler('Admin not found', 404));

        const isMatch = await admin.comparePassword(currentPassword);

        if (!isMatch) return next(new errorHandler('Current password is incorrect', 401));

        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });

    } catch (error) {
        next(error);
    }
}

// HANDLE ALL DASHBOARD RELATED ACTIONS
export const getDashboardStats = async (req, res, next) => {
    try {
        const recentUsersLimit = Math.min(Math.max(parseInt(req.query.recentUsersLimit) || 5, 1), 10);

        const [users, totalUsers, activeUsers, blockedUsers, totalBlogs] = await Promise.all([
            User.find({}, {
                _id: 1, name: 1, email: 1, username: 1, role: 1, active: 1, bio: 1, profileImage: 1, socialLinks: 1, following: 1, followers: 1, createdAt: 1
            }).sort({ createdAt: -1 }).limit(recentUsersLimit).lean(),
            User.countDocuments(),
            User.countDocuments({ active: true }),
            User.countDocuments({ active: false }),
            blogModel.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                blockedUsers,
                totalBlogs,
                recentJoinedUsers: users.map((user) => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    active: user.active,
                    bio: user?.bio,
                    profileImage: user?.profileImage?.url,
                    socialLinks: user?.socialLinks,
                    following: user?.following?.length,
                    followers: user?.followers?.length,
                    createdAt: user?.createdAt,
                })),
                recentJoinedUsersLimit: recentUsersLimit,
            },
        });
    } catch (error) {
        next(error);
    }
};


// HANDLE ALL USERS RELATED ACTIONS
// fetch all users ================== //
export const fetchUsers = async (req, res, next) => {
    try {

        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        const search = sanitizeQuery(req.query.search);

        if (page < 1)
            return next(new errorHandler('Page number cannot be less than 1', 400));

        if (limit < 5)
            return next(new errorHandler('Limit cannot be less than 5', 400));

        if (limit > 10)
            return next(new errorHandler('Limit cannot be greater than 10', 400));

        // if search query is provided
        // if (search) {
        const users = await User.find({
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }).lean().skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!users) return next(new errorHandler('No users found', 404));

        const totalUsers = await User.countDocuments().lean();
        const totalPages = Math.ceil(totalUsers / limit);

        const updated = users.map((user) => {
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role,
                active: user.active,
                bio: user?.bio,
                profileImage: user?.profileImage?.url,
                socialLinks: user?.socialLinks,
                following: user?.following?.length,
                followers: user?.followers?.length,
                createdAt: user?.createdAt,
            }
        });

        return res.status(200).json({
            success: true,
            data: updated,
            totalPages,
        });

    } catch (error) {
        next(error);
    }
}

// user block and unblock ======================= //
export const blockUnblockUser = async (req, res, next) => {
    try {

        let { userId, active } = req.body;

        if (!userId) return next(new errorHandler('Please provide userId', 400));

        if (active === undefined)
            return next(new errorHandler('Please provide active status', 400));

        if (active === null)
            return next(new errorHandler('Active status cannot be null', 400));

        // convert string to boolean
        if (active === 'true') active = true;
        if (active === 'false') active = false;

        if (typeof active !== 'boolean')
            return next(new errorHandler('Active status must be boolean', 400));

        const user = await User.findById(userId);

        if (!user) return next(new errorHandler('User not found', 404));

        let msg = active ?
            'User unblocked successfully' :
            'User blocked successfully';

        user.active = active;
        await user.save();

        res.status(200).json({
            success: true,
            message: msg,
        });

    } catch (error) {
        next(error);
    }
}

// get user details by id ======================= //
export const getUserDetailsById = async (req, res, next) => {
    try {

        const { userId } = req.params;

        if (!userId) return next(new errorHandler('Please provide userId', 400));
        const user = await User.findById(userId).lean();
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
        };

        if (user.profileImage?.url) {
            userData.profileImage = user.profileImage.url;
        }

        if (user.socialLinks) {
            userData.socialLinks = user.socialLinks;
        }

        return res.status(200).json({
            success: true,
            data: userData
        });

    } catch (error) {
        next(error);
    }

}


export const updateUser = async (req, res, next) => {
    try {

        let { userId, name, username, email, bio } = req.body;

        if (!userId) return next(new errorHandler('Please provide userId', 400));

        if (!name && !username && !email && !bio)
            return next(new errorHandler('Please provide at least one field to update', 400));

        const user = await User.findById(userId);

        if (!user) return next(new errorHandler('User not found', 404));

        if (name) user.name = name;
        if (username) {
            if (!username.startsWith('@')) {
                username = '@' + username;
            }
            user.username = username;
        };
        if (email) user.email = email;
        if (bio) user.bio = bio;

        if (!user.isModified()) return next(new errorHandler('No changes made', 400));

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

// HANDLE ALL BLOG RELATED ACTIONS
// get all blogs ====================== //
export const getBlogs = async (req, res, next) => {
    try {

        let query = req.query;

        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const search = sanitizeQuery(query.search);

        if (page < 1) return next(new errorHandler('Page number cannot be less than 1', 400));

        if (limit < 3) return next(new errorHandler('Limit cannot be less than 3', 400));

        if (limit > 10) return next(new errorHandler('Limit cannot be greater than 10', 400));

        const blogs = await blogModel.find({
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ]
        }).populate('author', 'name username profileImage')
            .lean()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (!blogs) return next(new errorHandler('No blogs found', 404));
        const totalBlogs = await blogModel.countDocuments().lean();
        const totalPages = Math.ceil(totalBlogs / limit);

        // Get comment counts in one query
        const commentCounts = await commentModel.aggregate([
            {
                $match: {
                    blogId: { $in: blogs.map((b) => b._id) }
                }
            },
            {
                $group: {
                    _id: "$blogId",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert commentCounts to a Map for quick lookup
        const commentMap = new Map();
        commentCounts.forEach(item => {
            commentMap.set(item._id.toString(), item.count);
        });

        const updated = blogs.map((blog) => {
            const commentCount = commentMap.get(blog._id.toString()) || 0;
            return {
                id: blog._id,
                title: blog.title,
                author: {
                    id: blog.author._id,
                    name: blog.author.name,
                    username: blog.author.username,
                    profileImage: blog?.author?.profileImage?.url,
                },
                tags: blog.tags,
                bannerImage: blog?.bannerImage?.url,
                isPublished: blog.isPublished,
                comments: commentCount,
                likes: blog?.likes?.length,
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt,
            }
        });

        res.status(200).json({
            success: true,
            data: updated,
            totalPages,
        });

    } catch (error) {
        next(error);
    }
}

// get blog details by id ====================== //
export const getBlogDetailsById = async (req, res, next) => {
    try {

        const { blogId } = req.params;

        if (!blogId) return next(new errorHandler('Please provide blogId', 400));

        const blog = await blogModel.findById(blogId)
            .populate('author', 'name username profileImage')
            .lean();

        if (!blog) return next(new errorHandler('Blog not found', 404));

        const blogData = {
            id: blog._id,
            title: blog.title,
            content: blog.content,
            tags: blog.tags,
            author: {
                id: blog.author._id,
                name: blog.author.name,
                username: blog.author.username,
                profileImage: blog?.author?.profileImage?.url,
            },
            bannerImage: blog.bannerImage.url,
            comments: blog.comments.length,
            likes: blog.likes.length,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
        };

        res.status(200).json({
            success: true,
            data: blogData,
        });

    } catch (error) {
        next(error);
    }
}

// update blog ====================== //
export const updateBlog = async (req, res, next) => {
    try {

        const { blogId, title, content, tags } = req.body;
        const bannerImage = req.file;

        const newTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

        if (!blogId) return next(new errorHandler('Please provide blogId', 400));

        if (!title && !content && !newTags)
            return next(new errorHandler('Please provide at least one field to update', 400));

        const blog = await blogModel.findById(blogId);

        if (!blog) return next(new errorHandler('Blog not found', 404));


        if (bannerImage) {
            if (blog.bannerImage.public_id) {
                await deleteFilesFromCloudinary(blog.bannerImage.public_id);
            }

            const uploadResult = await blog_image_upload(bannerImage);

            blog.bannerImage = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            };
        }

        if (title) blog.title = title;
        if (content) blog.content = content;
        if (tags) blog.tags = newTags;

        await blog.save();

        const updatedData = {
            id: blog._id,
            title: blog.title,
            content: blog.content,
            tags: blog.tags,
            author: blog.author,
            bannerImage: blog.bannerImage?.url || null,
            likes: blog.likes.length,
            comments: blog.comments.length,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
        };

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedData,
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

// delete blog ====================== //
export const deleteBlog = async (req, res, next) => {
    try {

        const blogId = req.params.blogId;

        if (!blogId) return next(new errorHandler('Please provide blogId', 400));

        const blog = await blogModel.findById(blogId);

        if (!blog) return next(new errorHandler('Blog not found', 404));

        await blogModel.deleteOne({ _id: blogId });

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
            data: {
                id: blog._id,
            },
        });

    } catch (error) {
        next(error);
    }
}

// blog publish and private ====================== //
export const blogPublishPrivate = async (req, res, next) => {
    try {

        let { blogId, isPublished } = req.body;

        if (!blogId) return next(new errorHandler('Please provide blogId', 400));

        if (isPublished === undefined) return next(new errorHandler('Please provide isPublished', 400));

        if (isPublished === null) return next(new errorHandler('isPublished cannot be null', 400));

        if (isPublished === 'true') isPublished = true;
        if (isPublished === 'false') isPublished = false;

        if (isPublished !== true && isPublished !== false)
            return next(new errorHandler('isPublished must be boolean', 400));

        const blog = await blogModel.findById(blogId);

        if (!blog) return next(new errorHandler('Blog not found', 404));

        blog.isPublished = isPublished;
        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: {
                id: blog._id,
                isPublished: blog.isPublished,
            },
        });

    } catch (error) {
        next(error);
    }
}



// fetch admins ====================== //
export const fetchAdmins = async (req, res, next) => {
    try {

        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        const search = sanitizeQuery(req.query.search);

        if (page < 1) return next(new errorHandler('Page number cannot be less than 1', 400));

        if (limit < 5) return next(new errorHandler('Limit cannot be less than 5', 400));

        if (limit > 10) return next(new errorHandler('Limit cannot be greater than 10', 400));

        const admins = await adminModel.find({
            _id: { $ne: req.user.id },
            $or: [
                { email: { $regex: search, $options: 'i' } }
            ]
        }).lean().skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!admins) return next(new errorHandler('No admins found', 404));

        // total admins
        const totalAdmins = await adminModel.countDocuments().lean();
        const totalPages = Math.ceil(totalAdmins / limit);

        const updated = admins.map((admin) => {
            return {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                active: admin.active,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
            }
        });

        res.status(200).json({
            success: true,
            data: updated,
            totalPages,
        });

    } catch (error) {
        next(error);
    }

}

// block and unblock admin ====================== //
export const blockUnblockAdmin = async (req, res, next) => {
    try {

        let { userId, active } = req.body;

        if (!userId) return next(new errorHandler('Please provide userId', 400));

        if (active === undefined) return next(new errorHandler('Please provide active status', 400));

        if (active === null) return next(new errorHandler('Active status cannot be null', 400));


        if (active === 'true') active = true;
        if (active === 'false') active = false;

        if (active !== true && active !== false) return next(new errorHandler('Active status must be boolean', 400));

        if (userId === req.user.id) return next(new errorHandler('Cannot block yourself', 400));

        const admin = await adminModel.findById(userId);

        if (!admin) return next(new errorHandler('Admin not found', 404));

        let msg = active ?
            'Admin unblocked successfully' :
            'Admin blocked successfully';

        admin.active = active;
        await admin.save();

        res.status(200).json({
            success: true,
            message: msg,
        });

    } catch (error) {
        next(error);
    }
}

// update admin ====================== //
export const updateAdmin = async (req, res, next) => {
    try {

        let { userId, name, role } = req.body;

        if (!userId) return next(new errorHandler('Please provide userId', 400));

        if (!name && !role)
            return next(new errorHandler('Please provide at least one field to update', 400));

        if (role && role !== 'admin' && role !== 'superadmin') {
            return next(new errorHandler('Invalid role', 400));
        }

        if (userId === req.user.id)
            return next(new errorHandler('Cannot update your own profile', 400));

        const admin = await adminModel.findById(userId);

        if (!admin) return next(new errorHandler('Admin not found', 404));

        if (name) admin.name = name;
        if (role) admin.role = role;

        if (!admin.isModified()) return next(new errorHandler('No changes made', 400));

        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
        });

    } catch (error) {
        next(error);
    }
}

