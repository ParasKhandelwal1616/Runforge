import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
    failureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Failure', required: true },
    errorType: { 
        type: String, 
        enum: ["dependency", "test", "build", "network", "timeout", "permission", "config"],
        required: true 
    },
    rootCause: { type: String, required: true },
    errorMessage: { type: String, required: true },
    fixSuggestions: [{
        suggestion: String,
        details: String
    }],
    bestFix: { type: String, required: true },
    severity: { 
        type: String, 
        enum: ["critical", "high", "medium", "low"],
        required: true 
    },
    relatedFiles: [String],
    retryCount: { type: Number, default: 0 },
    estimatedFixTime: { 
        type: String, 
        enum: ["5mins", "30mins", "2hours", "unknown"] 
    },
    model: { type: String, required: true },
    tokensUsed: { type: Number },
    cached: { type: Boolean, default: false },
    confidence: { 
        type: String, 
        enum: ["high", "medium", "low"],
        required: true 
    },
    embedding: [Number]
}, { timestamps: true });

// Indexes
analysisSchema.index({ failureId: 1 });
analysisSchema.index({ errorType: 1 });
analysisSchema.index({ createdAt: -1 });

export const Analysis = mongoose.model("Analysis", analysisSchema);
