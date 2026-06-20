import { Octokit } from '@octokit/rest'

export const postPRComment = async (
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  analysis: any
): Promise<number> => {
  const octokit = new Octokit({ auth: token })

  const body = formatComment(analysis)

  const { data } = await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner,
      repo,
      issue_number: prNumber,
      body
    }
  )

  console.log(`💬 PR comment posted: ${data.id}`)
  return data.id
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