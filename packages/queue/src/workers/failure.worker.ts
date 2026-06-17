import { Worker, Job } from 'bullmq'

const connection = {
  host: 'localhost',
  port: 6379
}

export const createFailureWorker = () => {
  const worker = new Worker('failure-analysis', async (job: Job) => {
    console.log(`Processing job ${job.id}:`, job.data)
    // TODO: fetch logs, call AI, post PR comment
  }, { connection })

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`)
  })

  worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error.message)
  })

  return worker
}