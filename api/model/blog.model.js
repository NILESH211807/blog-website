import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
        minlength: [5, 'Blog title must be at least 5 characters long'],
        index: true,
    },
    content: {
        type: String,
        required: [true, 'Blog content is required'],
        trim: true,
        minlength: [20, 'Blog content must be at least 20 characters long'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    tags: [{
        type: String,
        trim: true,
        index: true,
    }],
    bannerImage: {
        url: { type: String },
        public_id: { type: String }
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true, versionKey: false
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
