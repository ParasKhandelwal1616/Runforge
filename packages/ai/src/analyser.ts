import { GoogleGenerativeAI } from '@google/generative-ai'

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
  apiKey: string
): Promise<object> => {
  const genAI = new GoogleGenerativeAI(apiKey)
  
  const model = genAI.getGenerativeModel({
   model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT
  })

  const result = await model.generateContent(cleanedLog)
  const text = result.response.text()
  
  console.log('🤖 AI response received')
  
  try {
    const parsed = JSON.parse(text)
    return parsed
  } catch (error) {
    console.error('❌ Failed to parse AI response:', text)
    throw new Error('AI returned invalid JSON')
  }
}