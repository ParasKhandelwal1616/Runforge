import  mongoose from 'mongoose';

const failureSchema = new mongoose.Schema({
    _id: Object,
    installationId: Object,
    repoFullName: String,
    workflowName: String,
    branch: String,
    prNumber: Number,
    commitSHA: String,
    failedStep: String,
    cleanedLogs: String,
    startedAt: Date,
    failedAt: Date,
    resolved: Boolean,
    resolvedAt: Date,
    retryCount: Number,
    
});

export const Failure = mongoose.model('Failure', failureSchema);    