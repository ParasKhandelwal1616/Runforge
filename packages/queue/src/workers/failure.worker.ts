import { Worker, Job } from 'bullmq'


const connection = {
  host: 'localhost',
  port: 6379
}
type StepExtractor = (log: string) => string
type postComment = (token: string, owner: string, repo: string, prNumber: number, analysis: any) => Promise<number>
type TokenFetcher = (installationId: number) => Promise<string>
type LogFetcher = (owner: string, repo: string, runId: number, token: string) => Promise<string>
type Saver = (jobData: any, failedStep: string, cleanedLog: string, analysis: any) => Promise<any>
type Analyser = (log: string, apiKey: string, context: {
  repoFullName: string
  workflowName: string
  branch: string
  prNumber: number | null
}) => Promise<object>

export const createFailureWorker = (
  getToken: TokenFetcher,
  fetchLogs: LogFetcher,
  cleanLog: (log: string) => string,
  extractFailedStep: StepExtractor,
  analyseLog: Analyser,
  geminiApiKey: string,
  saveFailure: Saver,
  postComment: postComment
) => {
  const worker = new Worker('failure-analysis', async (job: Job) => {
    console.log(`Processing job ${job.id}:`, job.data)
    
const { installationId, repoFullName, runId, workflowName, branch, prNumber } = job.data
    const [owner, repo] = repoFullName.split('/')
    
    let token: string
try {
  token = await getToken(installationId)
  console.log(`🔑 Got token for installation: ${installationId}`)
} catch (error) {
  throw new Error(`Failed to get installation token: ${error}`)
}

    let logs: string
try {
  logs = await fetchLogs(owner, repo, runId, token)
  console.log(`📋 Logs fetched — length: ${logs.length} chars`)
} catch (error) {
  throw new Error(`Failed to fetch logs: ${error}`)
}

    let cleanedLog: string
try {
  cleanedLog = cleanLog(logs)
  console.log(`🧹 Cleaned log — length: ${cleanedLog.length} chars`)
} catch (error) {
  throw new Error(`Failed to clean log: ${error}`)
}

    let failedStep: string
try {
  failedStep = extractFailedStep(cleanedLog)
  console.log(`❌ Failed step: ${failedStep}`)
} catch (error) {
  throw new Error(`Failed to extract failed step: ${error}`)
}

    let analysis: any
try {
  analysis = await analyseLog(cleanedLog, geminiApiKey, {
    repoFullName,
    workflowName,
    branch,
    prNumber
  })
} catch (error) {
  throw new Error(`Failed to analyse log: ${error}`)
} 
console.log('🤖 Analysis:', JSON.stringify(analysis, null, 2))
try {
  await saveFailure(job.data, failedStep, cleanedLog, analysis)
} catch (error) {
  throw new Error(`Failed to save to database: ${error}`)
}



if (prNumber) {
  try {
    const commentId = await postComment(token, owner, repo, prNumber, analysis)
    console.log(`💬 Comment posted: ${commentId}`)
  } catch (error) {
    console.error(`⚠️ Failed to post comment (non-critical): ${error}`)
    // don't throw — job still succeeded
  }
}
    
  }, { connection })

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`)
  })

  worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error.message)
  })

  return worker
}