import { makeNewGameMatch } from '../../../../test/utils/factories'
import { Player } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases'
import { ClientBeginEventHandler } from './client-begin'

const makeSut = () => ({ sut: new ClientBeginEventHandler() })

describe('ClientBegin Event Handler', () => {
  test('do nothing if last match is not open', () => {
    const { sut } = makeSut()
    const input = 'any input'

    const lastMatch = makeNewGameMatch()
    lastMatch.isOpen = false
    const matches = [lastMatch]

    sut.handle(matches, '0:03', input)

    expect(matches[0].isOpen).toBe(false)
    expect(matches[0].players).toStrictEqual([])
  })

  test('throw MalformedInputError if input is empty', () => {
    const { sut } = makeSut()
    const input = ''
    const matches = [makeNewGameMatch()]

    const actual = () => { sut.handle(matches, '0:03', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("throw MalformedInputError if there's no player id", () => {
    const { sut } = makeSut()
    const input = 'anything but a number'
    const matches = [makeNewGameMatch()]

    const actual = () => { sut.handle(matches, '0:03', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('set joinedAt to player successfully', () => {
    const { sut } = makeSut()
    const input = '2'

    const match = makeNewGameMatch()
    match.players.push(new Player(2))
    const matches = [match]

    const gameTime = '0:03'
    sut.handle(matches, gameTime, input)

    expect(match.players[0].joinedAt).toEqual(gameTime)
  })
})
