import dotenv from 'dotenv'
dotenv.config()

export const env = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/runforge',
  PORT: process.env.PORT || 3001,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || '',
  GITHUB_APP_ID: process.env.GITHUB_APP_ID || '',
GITHUB_PRIVATE_KEY: process.env.GITHUB_PRIVATE_KEY || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || ''
}