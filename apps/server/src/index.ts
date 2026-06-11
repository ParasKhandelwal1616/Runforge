import express from 'express'
import connectDB from './config/db.js'
import { env } from './config/env.js'
import { Failure  } from '@runforge/db'
console.log('Models loaded:', { Failure })

const app = express()
const PORT = env.PORT

await connectDB()

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'runforge-server' })
})

app.listen(PORT, () => {
  console.log(`Runforge server running on port ${PORT}`)
})