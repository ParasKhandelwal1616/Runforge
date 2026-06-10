import express from 'express'

const app = express()
const PORT = 3001

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'runforge-server' })
})

app.listen(PORT, () => {
  console.log(`Runforge server running on port ${PORT}`)
})