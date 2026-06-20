import { Worker, Job } from 'bullmq'


const connection = {
  host: 'localhost',
  port: 6379
}
type StepExtractor = (log: string) => string
type TokenFetcher = (installationId: number) => Promise<string>
type LogFetcher = (owner: string, repo: string, runId: number, token: string) => Promise<string>

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
  geminiApiKey: string
) => {
  const worker = new Worker('failure-analysis', async (job: Job) => {
    console.log(`Processing job ${job.id}:`, job.data)
    
const { installationId, repoFullName, runId, workflowName, branch, prNumber } = job.data
    const [owner, repo] = repoFullName.split('/')
    
    const token = await getToken(installationId)
    console.log(`🔑 Got token for installation: ${installationId}`)

    const logs = await fetchLogs(owner, repo, runId, token)
console.log(`📋 Logs fetched — length: ${logs.length} chars`)

    const cleanedLog = cleanLog(logs)
console.log(`🧹 Cleaned log — length: ${cleanedLog.length} chars`)


const failedStep = extractFailedStep(cleanedLog)
console.log(`❌ Failed step: ${failedStep}`)

const analysis = await analyseLog(cleanedLog, geminiApiKey, {
  repoFullName,
  workflowName,
  branch,
  prNumber
})
console.log('🤖 Analysis:', JSON.stringify(analysis, null, 2))
    
  }, { connection })

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`)
  })

  worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error.message)
  })

  return worker
}