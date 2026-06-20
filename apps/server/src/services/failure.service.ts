import { Failure, Analysis } from '@runforge/db'

export const saveFailureAndAnalysis = async (
  jobData: any,
  failedStep: string,
  cleanedLog: string,
  analysis: any
) => {
  // Save failure
  const failure = await Failure.create({
    installationId: jobData.installationId,
    repoFullName: jobData.repoFullName,
    runId: jobData.runId,
    workflowName: jobData.workflowName,
    branch: jobData.branch,
    prNumber: jobData.prNumber,
    commitSHA: jobData.commitSHA,
    failedStep,
    cleanedLog,
    startedAt: jobData.startedAt,
    failedAt: jobData.failedAt,
    retryCount: jobData.retryCount,
    resolved: false
  })

  console.log(`💾 Failure saved: ${failure._id}`)

  // Save analysis
  const savedAnalysis = await Analysis.create({
    failureId: failure._id,
    errorType: analysis.errorType,
    rootCause: analysis.rootCause,
    errorMessage: analysis.errorMessage,
    fixSuggestions: analysis.fixSuggestions,
    bestFix: analysis.bestFix,
    severity: analysis.severity,
    relatedFiles: analysis.relatedFiles,
    estimatedFixTime: analysis.estimatedFixTime,
    model: 'llama-3.3-70b-versatile',
    cached: false,
    confidence: 'high'
  })

  console.log(`💾 Analysis saved: ${savedAnalysis._id}`)

  return { failure, analysis: savedAnalysis }
}