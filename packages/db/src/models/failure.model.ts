import mongoose from "mongoose";

const failureSchema = new mongoose.Schema({
    runId: { type: Number, required: true },
    installationId: { type: Number, required: true },
    repoFullName: { type: String, required: true },
    workflowName: { type: String, required: true },
    branch: { type: String, required: true },
    prNumber: { type: Number },
    commitSHA: { type: String, required: true },
    commentId: { type: Number },
    failedStep: { type: String },
    cleanedLog: { type: String },
    startedAt: { type: Date },
    failedAt: { type: Date, required: true },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    retryCount: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes
failureSchema.index({ repoFullName: 1, failedAt: -1 });
failureSchema.index({ installationId: 1 });
failureSchema.index({ resolved: 1 });
failureSchema.index({ failedAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

export const Failure = mongoose.model("Failure", failureSchema);
