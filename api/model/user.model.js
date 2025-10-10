import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true,
      index: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
   },
   username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
   },
   password: {
      type: String,
      required: true,
      select: false,
   },
   profileImage: {
      url: { type: String },
      public_id: { type: String }
   },
   role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
   },
   active: {
      type: Boolean,
      default: true
   },
   bio: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "Welcome to my blog"
   },
   following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   }],
   followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   }],
   socialLinks: {
      youtube: { type: String },
      instagram: { type: String },
      facebook: { type: String },
      twitter: { type: String },
   },
}, { timestamps: true, versionKey: false });

// Hash password before saving
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();
   this.password = await bcrypt.hash(this.password, 10);
   next();
});


userSchema.methods.generateToken = async function () {
   const token = jwt.sign(
      { id: this._id, role: this.role },
      process.env.JWT_SECRET, { expiresIn: "1d" }
   );
   return token;
};

userSchema.methods.comparePassword = async function (password) {
   return await bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema);
export default User;
