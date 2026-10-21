export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (input.trim().startsWith('+') || digits.length !== 11 || !digits.startsWith('8')) {
    return digits
  }
  return digits.startsWith('80') ? `375${digits.slice(2)}` : `7${digits.slice(1)}`
}
