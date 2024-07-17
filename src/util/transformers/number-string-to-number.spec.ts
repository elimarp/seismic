import { parseNumberStringToNumber } from './number-string-to-number'

describe('parseNumberStringToNumber Transformer', () => {
  test('ensure simple input is returned properly', () => {
    const input = '1'
    const actual = parseNumberStringToNumber(input)

    expect(actual).toBe(1)
  })

  test('ensure mixed input is returned properly', () => {
    const input = '= 1'
    const actual = parseNumberStringToNumber(input)

    expect(actual).toBe(1)
  })
})
