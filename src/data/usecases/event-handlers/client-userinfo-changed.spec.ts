import { MalformedInputError } from '../../../domain/usecases'
import { makeNewGameMatch } from '../../../../test/utils/factories'
import { ClientUserInfoChangedEventHandler } from './client-userinfo-changed'
import { Player } from '../../../domain/models'
import { TEAMS } from '../../../util/constants'

const makeSut = () => ({ sut: new ClientUserInfoChangedEventHandler() })

describe('ClientUserinfoChanged Event Handler', () => {
  test('throw MalformedInputError if input is empty', () => {
    const { sut } = makeSut()
    const input = ''
    const matches = [makeNewGameMatch()]

    const actual = () => { sut.handle(matches, '0:02', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('throw MalformedInputError if playerId is not a positive number', () => {
    const { sut } = makeSut()
    const input = 'a n\\playername\\t\\0\\model\\uriel/zael\\hmodel\\uriel/zael\\g_redteam\\\\g_blueteam\\\\c1\\5\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl\\0'
    const matches = [makeNewGameMatch()]

    const actual = () => { sut.handle(matches, '0:02', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('update player info successfully', () => {
    const { sut } = makeSut()
    const input = '2 n\\johnDoeNTC\\t\\0\\model\\uriel/zael\\hmodel\\uriel/zael\\g_redteam\\\\g_blueteam\\\\c1\\5\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl\\0'

    const currentMatch = makeNewGameMatch()
    currentMatch.players.push(new Player(2))
    const matches = [currentMatch]

    sut.handle(matches, '0:02', input)

    expect(currentMatch.players[0].inGameId).toEqual(2)
    expect(currentMatch.players[0].nickname).toEqual('johnDoeNTC')
    expect(currentMatch.players[0].team).toEqual(TEAMS.TEAM_FREE)
  })
})
