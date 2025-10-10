import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [30, 'Name cannot exceed 30 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    },
    profileImage: {
        url: { type: String },
        public_id: { type: String }
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

// Hash password before saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate token
adminSchema.methods.generateToken = async function () {
    const token = jwt.sign(
        { id: this._id, role: this.role, email: this.email },
        process.env.JWT_SECRET, { expiresIn: "1d" }
    );
    return token;
};



const adminModel = mongoose.model("Admin", adminSchema);

export default adminModel;
