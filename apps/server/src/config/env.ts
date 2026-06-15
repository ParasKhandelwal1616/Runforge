import dotenv from 'dotenv'
dotenv.config()

export const env = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/runforge',
  PORT: process.env.PORT || 3001,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'runforge_webhook_secret_local'
}