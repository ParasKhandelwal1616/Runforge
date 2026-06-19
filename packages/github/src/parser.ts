
export const cleanLog = (rawLog: string): string => {
  let cleaned = rawLog

  // remove timestamps
  cleaned = cleaned.replace(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z\s/gm, '')

  // remove ANSI color codes
  cleaned = cleaned.replace(/\x1b\[[0-9;]*m/g, '')

  // remove GitHub markers
cleaned = cleaned.replace(/##\[.*?\]/g, '')

  // remove blank lines
  cleaned = cleaned.replace(/^\s*$/gm, '')

  return cleaned.trim()
}