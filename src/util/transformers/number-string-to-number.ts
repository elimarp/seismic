export const parseNumberStringToNumber = (str: string): number => {
  const match = str.match(/\d+/)
  if (!match?.[0]) return 0
  return Number(match[0])
}
