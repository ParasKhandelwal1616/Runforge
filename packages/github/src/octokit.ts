import { App } from '@octokit/app'
import fs from 'fs'

let githubApp: App

export const initGithubApp = (appId: string, privateKeyPath: string) => {
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
  
  githubApp = new App({
    appId,
    privateKey
  })
}

export const getGithubApp = () => {
  if (!githubApp) {
    throw new Error('GitHub App not initialized. Call initGithubApp first.')
  }
  return githubApp
}