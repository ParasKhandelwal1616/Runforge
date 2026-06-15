import express from 'express'
import connectDB from './config/db.js'
import { env } from './config/env.js'
import webhookRouter from './routes/webhook.routes.js'


const app = express()
const PORT = env.PORT

await connectDB()

app.use(express.json())
app.use('/webhooks', webhookRouter)


app.listen(PORT, () => {
  console.log(`Runforge server running on port ${PORT}`)
})