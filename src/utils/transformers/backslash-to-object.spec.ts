import { parseBackslashDelimitedStringToObject } from './backslash-to-object'

describe('Backslash To Object Transformer', () => {
  test("return empty object if input isn't truthy", () => {
    const input1 = ''
    const input2 = 0
    const input3 = null
    const input4 = undefined

    expect(parseBackslashDelimitedStringToObject(input1)).toStrictEqual({})
    expect(parseBackslashDelimitedStringToObject(input2 as unknown as string)).toStrictEqual({})
    expect(parseBackslashDelimitedStringToObject(input3 as unknown as string)).toStrictEqual({})
    expect(parseBackslashDelimitedStringToObject(input4 as unknown as string)).toStrictEqual({})
  })

  test("return empty object if input isn't a string", () => {
    const input1 = 1
    const input2 = {}
    const input3 = true

    expect(parseBackslashDelimitedStringToObject(input1 as unknown as string)).toStrictEqual({})
    expect(parseBackslashDelimitedStringToObject(input2 as unknown as string)).toStrictEqual({})
    expect(parseBackslashDelimitedStringToObject(input3 as unknown as string)).toStrictEqual({})
  })

  test('return object successfully with input starting with backslash', () => {
    const input = '\\c\\1\\a\\2\\b\\3'
    const expected = { a: '2', b: '3', c: '1' }
    expect(parseBackslashDelimitedStringToObject(input)).toStrictEqual(expected)
  })

  test('return object successfully with input starting with NO backslash', () => {
    const input = 'c\\1\\a\\2\\b\\3'
    const expected = { a: '2', b: '3', c: '1' }
    expect(parseBackslashDelimitedStringToObject(input)).toStrictEqual(expected)
  })
})
