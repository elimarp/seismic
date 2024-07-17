import { makeNewGameMatch } from '../../../../test/utils/factories'
import { Player } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases'
import { ClientConnectEventHandler } from './client-connect'

const makeSut = () => ({ sut: new ClientConnectEventHandler() })

describe('ClientConnect Event Handler', () => {
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

    const actual = () => { sut.handle(matches, '0:01', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("throw MalformedInputError if there's no player id", () => {
    const { sut } = makeSut()
    const input = 'anything but a number'
    const matches = [makeNewGameMatch()]

    const actual = () => { sut.handle(matches, '0:01', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("do nothing if player's id is already in use", () => {
    const { sut } = makeSut()
    const input = '2'

    const match = makeNewGameMatch()
    match.players.push(new Player(2))
    const matches = [match]

    sut.handle(matches, '0:01', input)

    expect(matches[0].players.length).toBe(1)
    expect(matches[0].players[0].inGameId).toBe(2)
  })

  test("add player to players if it's the first", () => {
    const { sut } = makeSut()
    const input = '2'
    const matches = [makeNewGameMatch()]

    sut.handle(matches, '0:01', input)

    expect(matches[0].players.length).toBe(1)
    expect(matches[0].players[0]).toStrictEqual(new Player(2))
  })

  test("add player to players if it's NOT the first", () => {
    const { sut } = makeSut()
    const input = '3'

    const match = makeNewGameMatch()
    match.players.push(new Player(2))
    const matches = [match]

    sut.handle(matches, '0:01', input)

    expect(matches[0].players.length).toBe(2)
    expect(matches[0].players[1]).toStrictEqual(new Player(3))
  })
})
