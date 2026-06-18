import { Worker, Job } from 'bullmq'

const connection = {
  host: 'localhost',
  port: 6379
}

type TokenFetcher = (installationId: number) => Promise<string>

export const createFailureWorker = (getToken: TokenFetcher) => {
  const worker = new Worker('failure-analysis', async (job: Job) => {
    console.log(`Processing job ${job.id}:`, job.data)
    
    const { installationId, repoFullName, runId } = job.data
    
    const token = await getToken(installationId)
    console.log(`🔑 Got token for installation: ${installationId}`)
    
  }, { connection })

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`)
  })

  worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error.message)
  })

  return worker
}