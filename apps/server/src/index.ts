import express from 'express'
import connectDB from './config/db.js'
import { env } from './config/env.js'
import webhookRouter from './routes/webhook.routes.js'
import { createFailureWorker } from '@runforge/queue'
import { initGithubApp } from '@runforge/github'
import { getInstallationToken, fetchFailureLogs , cleanLog , extractFailedStep} from '@runforge/github'
import { analyseLog } from '@runforge/ai'
import { saveFailureAndAnalysis } from './services/failure.service.js'


const app = express()
const PORT = env.PORT

await connectDB()
createFailureWorker(
  (installationId) => getInstallationToken(
    installationId,
    env.GITHUB_APP_ID,
    env.GITHUB_PRIVATE_KEY_PATH
  ),
  fetchFailureLogs ,
  cleanLog,
  extractFailedStep,
  analyseLog,
  env.GROQ_API_KEY,
  saveFailureAndAnalysis
)
console.log('🔧 Failure worker started')

initGithubApp(env.GITHUB_APP_ID, env.GITHUB_PRIVATE_KEY_PATH)
console.log('🐙 GitHub App initialized')

app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf
  }
}))
app.use('/webhooks', webhookRouter)


app.listen(PORT, () => {
  console.log(`Runforge server running on port ${PORT}`)
})