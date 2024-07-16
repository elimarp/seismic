type Options = { allowedKeys: string[] }
export const parseBackslashDelimitedStringToObject = (str: string, options?: Options): Record<string, string> => {
  if (!str || typeof str !== 'string') return {}

  const trimmed = str.trim()
  const keyValueArray = trimmed.startsWith('\\') ? trimmed.substring(1).split('\\') : trimmed.split('\\')

  let lastKey: string = ''
  return keyValueArray.reduce<Record<string, string>>((accumulator, current, i) => {
    if (i % 2 === 0) {
      lastKey = current
      return accumulator
    }

    accumulator[lastKey] = current
    return accumulator
  }, {})
}
