import { Octokit } from '@octokit/rest'
import unzipper from 'unzipper'

export const fetchFailureLogs = async (
  owner: string,
  repo: string,
  runId: number,
  token: string
): Promise<string> => {
  const octokit = new Octokit({ auth: token })

  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs',
    { owner, repo, run_id: runId }
  )

  const buffer = Buffer.from(response.data as ArrayBuffer)
  const directory = await unzipper.Open.buffer(buffer)

  let allLogs = ''
  
  for (const file of directory.files) {
    const content = await file.buffer()
    allLogs += `\n--- ${file.path} ---\n`
    allLogs += content.toString('utf8')
  }

  return allLogs
}