import { App } from '@octokit/app'

let githubApp: App

export const initGithubApp = (appId: string, privateKey: string) => {
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