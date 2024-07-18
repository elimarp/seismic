import { makeNewGameMatch } from '../../../../test/utils/factories'
import { Player } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases'
import { ItemEventHandler } from './item'

const makeSut = () => ({ sut: new ItemEventHandler() })
const makeInput = (id: string) => {
  return `${id} weapon_rocketlauncher`
}

describe('Item Event Handler', () => {
  test('do nothing if last match is not open', () => {
    const { sut } = makeSut()
    const input = 'any input'

    const lastMatch = makeNewGameMatch()
    lastMatch.isOpen = false
    const matches = [lastMatch]

    sut.handle(matches, '0:00', input)

    expect(matches[0].isOpen).toBe(false)
    expect(matches[0].players).toStrictEqual([])
  })

  test('throw MalformedInputError if input is empty', () => {
    const { sut } = makeSut()
    const input = ''
    const matches = [makeNewGameMatch()]

    const actual = () => { sut.handle(matches, '0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('throw MalformedInputError if playerId is not a positive number', () => {
    const { sut } = makeSut()
    const input = makeInput('a')
    const matches = [makeNewGameMatch()]

    const actual = () => { sut.handle(matches, '0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("throw MalformedInputError if player isn't found", () => {
    const { sut } = makeSut()
    const input = makeInput('3')

    const match = makeNewGameMatch()
    match.players.push(new Player(2))
    const matches = [match]

    const actual = () => { sut.handle(matches, '0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('add item to player items successfully', () => {
    const { sut } = makeSut()
    const input = makeInput('2')

    const match = makeNewGameMatch()
    match.players.push(new Player(2))
    const matches = [match]

    const matchTime = '0:05'
    sut.handle(matches, matchTime, input)

    expect(match.players[0].items.length).toBe(1)
    expect(match.players[0].items[0]).toEqual({
      name: 'weapon_rocketlauncher',
      collectedAt: matchTime
    })
  })
})
