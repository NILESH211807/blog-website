import React from 'react'
import { FiTrash2, FiEyeOff, FiUser, FiEye } from 'react-icons/fi';
import { FaHeart, FaComment } from 'react-icons/fa';

const AdminBlogItem = ({ blog, getDeletedBlogId, handlePublishPrivateBlog }) => {

    return (
        <div className="bg-base-100 rounded-sm overflow-hidden hover:shadow-sm transition-all duration-300 border border-base-300">
            <div className="relative h-48 w-full">
                <img
                    src={blog?.bannerImage}
                    alt="Blog Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="p-5">
                <div className="flex items-center mb-4">
                    {
                        blog?.author?.profileImage ? (
                            <img
                                src={blog?.author?.profileImage}
                                alt="Author"
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-base-300 flex items-center justify-center">
                                <FiUser size={23} />
                            </div>
                        )
                    }
                    <div className="ml-3">
                        <h3 className="font-semibold text-base-content">{blog?.author?.name}</h3>
                        <p className="text-sm text-base-content/50">{blog?.author?.username}</p>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-base-content mb-3 line-clamp-2">
                    {blog?.title}
                </h2>

                <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center text-base-content/50 bg-base-200 px-3 py-1.5 rounded-full">
                        <FaHeart className="text-red-500 mr-2" />
                        <span className="font-medium">{blog?.likes || 0}</span>
                    </div>
                    <div className="flex items-center text-base-content/50 bg-base-200 px-3 py-1.5 rounded-full">
                        <FaComment className="text-blue-500 mr-2" />
                        <span className="font-medium">{blog?.comments || 0}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-base-300">
                    <button type='button' onClick={() => getDeletedBlogId(blog)} className="flex items-center cursor-pointer px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        <FiTrash2 className="mr-2" />
                        Delete
                    </button>
                    <button onClick={() => handlePublishPrivateBlog(blog?.id, !blog?.isPublished)} className="flex items-center cursor-pointer px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                        {blog?.isPublished ? <FiEyeOff className="mr-2" /> : <FiEye className="mr-2" />}
                        {blog?.isPublished ? 'Private' : 'Public'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminBlogItem
