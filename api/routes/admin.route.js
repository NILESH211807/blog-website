import express from 'express';
import { blockUnblockAdmin, blockUnblockUser, blogPublishPrivate, changeAdminPassword, createAdmin, deleteBlog, fetchAdmins, fetchUsers, getAdminProfile, getBlogDetailsById, getBlogs, getDashboardStats, getUserDetailsById, loginAdmin, logoutAdmin, updateAdmin, updateAdminProfile, updateAdminProfileImage, updateBlog, updateUser } from '../controller/admin.controller.js';
import { createAdminValidator, loginAdminValidator } from '../validator/admin.validator.js';
import { validateRequest } from '../middleware/errorMiddleware.js';
import { checkIsAuth, superAdminAccess } from '../middleware/adminMiddleware.js';
import { uploadProfile } from '../middleware/upload.js';
const router = express.Router();

// create admin ============ //
router.post('/create', checkIsAuth, superAdminAccess, createAdminValidator, validateRequest, createAdmin);

// login admin ============ //
router.post('/auth/login', loginAdminValidator, validateRequest, loginAdmin);

// logout admin ============ //
router.get('/auth/logout', logoutAdmin);

// get admin details ============ //
router.get('/profile', checkIsAuth, getAdminProfile);

// update admin profile ============ //
router.put('/update-profile', checkIsAuth, updateAdminProfile);

// change admin password ============ //
router.put('/change-password', checkIsAuth, changeAdminPassword);

// update admin profile image ============ //
router.put('/update-profile-image', checkIsAuth, uploadProfile.single('profile_image'), updateAdminProfileImage);

// get dashboard stats ============ //
router.get('/dashboard-stats', checkIsAuth, getDashboardStats);

// HANDLE ALL USERS RELATED ROUTERS
// fetch all users =========== //
router.get('/users', checkIsAuth, fetchUsers);

// block and unblock user =========== //
router.put('/user/block-unblock-user', checkIsAuth, blockUnblockUser);

// get user details by id =========== //
router.get('/user/:userId', checkIsAuth, getUserDetailsById);

// edit user =========== //
router.put('/user/update-user', checkIsAuth, updateUser);

// HANDLE ALL BLOGS RELATED ROUTERS

// get all blogs =========== //
router.get('/blogs', checkIsAuth, getBlogs);

// get blog details by id =========== //
router.get('/blog/:blogId', checkIsAuth, getBlogDetailsById);

// update blog =========== //
router.put('/blog/update-blog', checkIsAuth, uploadProfile.single('bannerImage'), updateBlog);

// delete blog =========== //
router.delete('/blog/delete/:blogId', checkIsAuth, deleteBlog);

// blog publish and private =========== //
router.put('/blog/publish-private', checkIsAuth, blogPublishPrivate);


// HANDLE ALL ADMINS RELATED ROUTERS
// fetch all admins =========== //
router.get('/admins', checkIsAuth, fetchAdmins);

// block and unblock admin =========== //
router.put('/block-unblock-admin',
    checkIsAuth,
    superAdminAccess,
    blockUnblockAdmin);

// update admin =========== //
router.put('/update-admin',
    checkIsAuth,
    superAdminAccess,
    updateAdmin);


export default router;