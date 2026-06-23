import { App } from '@octokit/app'
import fs from 'fs'

export const getInstallationToken = async (
  installationId: number,
  appId: string,
  privateKeyContent: string  // ← key content, not path
): Promise<string> => {
  // NEW — key content passed directly
const privateKey = privateKeyContent
  
  const app = new App({ appId, privateKey })
  
  const installationOctokit = await app.getInstallationOctokit(installationId)
  
  const { data } = await installationOctokit.request(
    'POST /app/installations/{installation_id}/access_tokens',
    { installation_id: installationId }
  )
  
  return data.token
}