import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
}, { timestamps: true, versionKey: false });

const bookmarkModel = mongoose.model('bookmark', bookmarkSchema);

export default bookmarkModel;
