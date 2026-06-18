import { Worker, Job } from 'bullmq'


const connection = {
  host: 'localhost',
  port: 6379
}

type TokenFetcher = (installationId: number) => Promise<string>
type LogFetcher = (owner: string, repo: string, runId: number, token: string) => Promise<string>

export const createFailureWorker = (getToken: TokenFetcher, fetchLogs: LogFetcher) => {
  const worker = new Worker('failure-analysis', async (job: Job) => {
    console.log(`Processing job ${job.id}:`, job.data)
    
    const { installationId, repoFullName, runId } = job.data
    const [owner, repo] = repoFullName.split('/')
    
    const token = await getToken(installationId)
    console.log(`🔑 Got token for installation: ${installationId}`)

    const logs = await fetchLogs(owner, repo, runId, token)
console.log(`📋 Logs fetched — length: ${logs.length} chars`)
    
  }, { connection })

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`)
  })

  worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error.message)
  })

  return worker
}