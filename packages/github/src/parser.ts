// Function 1 - already exists
export const cleanLog = (rawLog: string): string => {
  let cleaned = rawLog
  cleaned = cleaned.replace(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z\s/gm, '')
  cleaned = cleaned.replace(/\x1b\[[0-9;]*m/g, '')
  cleaned = cleaned.replace(/##\[.*?\]/g, '')
  cleaned = cleaned.replace(/^\s*$/gm, '')
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
  return cleaned.trim()
}

// Function 2 - new one
export const extractFailedStep = (cleanedLog: string): string => {
  const lines = cleanedLog.split('\n')
  const errorLine = lines.reverse().find(line => 
    line.includes('Error') || 
    line.includes('error') || 
    line.includes('failed') ||
    line.includes('exit code')
  )
  return errorLine?.trim() || 'Unknown step'
}