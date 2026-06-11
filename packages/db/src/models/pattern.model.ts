import mongoose from "mongoose";

const patternSchema = new mongoose.Schema({
    repoFullName: { type: String, required: true },
    errorType: { type: String, required: true },
    occurrenceCount: { type: Number, default: 1 },
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
    failureIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Failure' }],
    embedding: [Number],
    suggestedFix: { type: String },
    installationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Installation', required: true },
    isResolved: { type: Boolean, default: false },
    resolvedAt: { type: Date }
}, { timestamps: true });

// Indexes
patternSchema.index({ repoFullName: 1 });
patternSchema.index({ isResolved: 1 });
patternSchema.index({ errorType: 1 });
patternSchema.index({ lastSeenAt: -1 });
patternSchema.index({ repoFullName: 1, errorType: 1 });

export const Pattern = mongoose.model("Pattern", patternSchema);
