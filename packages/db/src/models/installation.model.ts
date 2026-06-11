import mongoose from "mongoose";

const installationSchema = new mongoose.Schema({
    installationId: { type: Number, required: true, unique: true },
    accountLogin: { type: String, required: true },
    accountType: { type: String, enum: ['User', 'Organization'], required: true },
    repoSelection: { type: String, required: true },
    selectedRepos: { type: [String], required: true },
    permissions: {type: Object, required: true },
    installedAt: { type: Date, required: true },
    isActive: { type: Boolean, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uninstalledAt: { type: Date },
    plan: { type: String, enum: ['free', 'starter', 'pro'], default: 'free' }
},{timestamps: true });

export const Installation = mongoose.model("Installation", installationSchema);