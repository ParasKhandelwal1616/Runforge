import dotenv from 'dotenv'
dotenv.config()

export const env = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/runforge',
  PORT: process.env.PORT || 3001
}