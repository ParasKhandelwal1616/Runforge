import { App } from '@octokit/app'
import fs from 'fs'

export const getInstallationToken = async (
  installationId: number,
  appId: string,
  privateKeyPath: string
): Promise<string> => {
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
  
  const app = new App({ appId, privateKey })
  
  const installationOctokit = await app.getInstallationOctokit(installationId)
  
  const { data } = await installationOctokit.request(
    'POST /app/installations/{installation_id}/access_tokens',
    { installation_id: installationId }
  )
  
  return data.token
}