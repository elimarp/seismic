import { MalformedInputError } from '../../../domain/usecases'
import { makeNewGameMatch, makeNewPlayer } from '../../../../test/utils/factories'
import { ClientUserInfoChangedEventHandler } from './client-userinfo-changed'
import { TEAMS } from '../../../util/constants'
import { type AddPlayerProtocol, type GetOpenMatchProtocol, type GetPlayerProtocol } from '../../protocols'
import { type Match, type Player, type PlayerInfo } from '../../../domain/models'

const makeInput = (id: string, nickname: string) => `${id} n\\${nickname}\\t\\0\\model\\uriel/zael\\hmodel\\uriel/zael\\g_redteam\\\\g_blueteam\\` +
'\\c1\\5\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl\\0'

class MatchRepositoryStub implements GetOpenMatchProtocol, GetPlayerProtocol, AddPlayerProtocol {
  addPlayer (id: number, info: PlayerInfo): void {}

  getOpenMatch (): Match | null {
    return makeNewGameMatch()
  }

  getPlayer (id: number): Player | null {
    return makeNewPlayer()
  }
}
const makeSut = () => {
  const matchRepositoryStub = new MatchRepositoryStub()
  return {
    sut: new ClientUserInfoChangedEventHandler(matchRepositoryStub, matchRepositoryStub, matchRepositoryStub),
    matchRepositoryStub
  }
}

describe('ClientUserinfoChanged Event Handler', () => {
  test('throw MalformedInputError if input is empty', () => {
    const { sut } = makeSut()
    const input = ''

    const actual = () => { sut.handle('0:02', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('throw MalformedInputError if playerId is not a positive number', () => {
    const { sut } = makeSut()
    const input = makeInput('a', 'nickname')

    const actual = () => { sut.handle('0:02', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('call addPlayer correctly with nickname containing spaces', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput('2', 'stan is law')

    const spied = jest.spyOn(matchRepositoryStub, 'addPlayer')

    sut.handle('0:02', input)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(2, {
      nickname: 'stan is law',
      team: TEAMS.TEAM_FREE
    })
  })

  test('call addPlayer correctly', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput('2', 'daKillerNTC')

    const spied = jest.spyOn(matchRepositoryStub, 'addPlayer')

    sut.handle('0:02', input)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(2, {
      nickname: 'daKillerNTC',
      team: TEAMS.TEAM_FREE
    })
  })
})
