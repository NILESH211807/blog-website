import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../config/cloudinary.js';
cloudinary.config(cloudinaryConfig);

// upload profile image
const profile_image_upload = async (file) => {
   try {
      const result = await cloudinary.uploader.upload(file.path, {
         folder: 'blog_app/profile_images',
         transformation: {
            width: 500,
            height: 500,
            crop: 'thumb',
            quality: "auto:low",
            fetch_format: "webp"
         }
      });

      return result;
   } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
   }
}

// delete image from cloudinary
const deleteFilesFromCloudinary = async (publicIds) => {
   try {
      const result = await cloudinary.uploader.destroy(publicIds);
      return result;
   } catch (error) {
      throw error;
   }
}

// upload blog image 
const blog_image_upload = async (file) => {
   try {
      const result = await cloudinary.uploader.upload(file.path, {
         folder: 'blog_app/blog_images',
         transformation: {
            quality: "auto:low",
            fetch_format: "webp"
         }
      });
      return result;
   } catch (error) {
      throw error;
   }
}


export { profile_image_upload, deleteFilesFromCloudinary, blog_image_upload };