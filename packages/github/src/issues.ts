import { Octokit } from '@octokit/rest'

export const createFailureIssue = async (
  token: string,
  owner: string,
  repo: string,
  analysis: any,
  workflowName: string,
  branch: string
): Promise<number> => {
  const octokit = new Octokit({ auth: token })

  const title = `CI Failure: ${workflowName} on ${branch}`
  const body = formatComment(analysis)

  const { data } = await octokit.request(
    'POST /repos/{owner}/{repo}/issues',
    {
      owner,
      repo,
      title,
      body,
      labels: ['ci-failure']
    }
  )

  console.log(`🐛 Issue created: #${data.number}`)
  return data.number
}
const formatComment = (analysis: any): string => {
  return `## 🔴 CI Failure Analysis — Runforge

**Error Type:** \`${analysis.errorType}\`
**Severity:** \`${analysis.severity}\`
**Estimated Fix Time:** ${analysis.estimatedFixTime}

---

### 🎯 Root Cause
${analysis.rootCause}

### ❌ Error Message
\`\`\`
${analysis.errorMessage}
\`\`\`

### 🔧 Suggested Fixes

${analysis.fixSuggestions.map((fix: any, i: number) => `**${i + 1}. ${fix.title}** *(${fix.confidence} confidence)*
${fix.description}`).join('\n\n')}

---

### ✅ Best Fix
${analysis.bestFix}

---
<sub>🤖 Analyzed by <a href="https://runforge.dev">Runforge</a></sub>`
}