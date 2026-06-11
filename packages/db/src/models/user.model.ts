import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    githubId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    avatarUrl: { type: String },
    role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' },
    lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
