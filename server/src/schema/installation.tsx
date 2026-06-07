import mongoose from 'mongoose';

const installationSchema = new mongoose.Schema({
    _id: Object,
    installationId: Number,
    accountLogin: String,
    repoSelection: String,
    selectedRepos: [String],
    permissions: Object,
    installedAt: Date,
    isActive: Boolean,
    unsubscribedAt: Date,
    plan: String,

});

export const Installation = mongoose.model('Installation', installationSchema);