import Groq from 'groq-sdk'

const SYSTEM_PROMPT = `You are a CI/CD expert analyzing GitHub Actions failure logs.
Analyze the log and respond ONLY with valid JSON matching this exact schema:
{
  "errorType": "dependency|test|build|network|timeout|permission|config",
  "rootCause": "plain English explanation of why it failed",
  "errorMessage": "exact error line from the log",
  "fixSuggestions": [
    {
      "title": "short fix title",
      "description": "detailed explanation",
      "confidence": "high|medium|low"
    }
  ],
  "bestFix": "single best fix recommendation",
  "severity": "critical|high|medium|low",
  "relatedFiles": ["files mentioned in error"],
  "estimatedFixTime": "5mins|30mins|2hours|unknown"
}
No text outside the JSON. No markdown backticks.`

export const analyseLog = async (
  cleanedLog: string,
  apiKey: string,
  context: {
    repoFullName: string
    workflowName: string
    branch?: string
    prNumber?: number | null
  }
): Promise<object> => {
  const groq = new Groq({ apiKey })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: cleanedLog }
    ],
    temperature: 0.1,
    max_tokens: 1024,
    response_format: { type: 'json_object' }
  })

  const text = completion.choices[0]?.message?.content || ''
  
  console.log('🤖 AI response received')

  try {
    const parsed = JSON.parse(text)
    return parsed
  } catch (error) {
    console.error('❌ Failed to parse AI response:', text)
    throw new Error('AI returned invalid JSON')
  }
}