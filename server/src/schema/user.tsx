import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: String,
    githubId: String,
    username: String,
    email: String,
    avatarUrl: String,
    role: String,
    createdAt: Date,
    lastactiveAt: Date,
});

export const User = mongoose.model("User", userSchema);