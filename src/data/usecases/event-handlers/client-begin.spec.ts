import { makeNewGameMatch } from '../../../../test/utils/factories'
import { Player, type Match, type PlayerInfo } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases'
import { TEAMS } from '../../../util/constants'
import { type GetOpenMatchProtocol, type GetPlayerProtocol } from '../../protocols'
import { type UpdatePlayerProtocol } from '../../protocols/match/update-player'
import { ClientBeginEventHandler } from './client-begin'

class MatchRepositoryStub implements GetOpenMatchProtocol, GetPlayerProtocol, UpdatePlayerProtocol {
  matches: Match[] = [makeNewGameMatch()]

  updatePlayer (id: number, data: Partial<PlayerInfo & { joinedAt: string }>): void {}

  getOpenMatch (): Match | null {
    return this.matches[0]
  }

  getPlayer (id: number): Player | null { return null }
}
const makeSut = () => {
  const matchRepositoryStub = new MatchRepositoryStub()
  return {
    sut: new ClientBeginEventHandler(matchRepositoryStub, matchRepositoryStub, matchRepositoryStub),
    matchRepositoryStub
  }
}

describe('ClientBegin Event Handler', () => {
  test('skip if last match is not open', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = 'any input'

    const getOpenMatchSpy = jest.spyOn(matchRepositoryStub, 'getOpenMatch')
    getOpenMatchSpy.mockReturnValueOnce(null)

    const updatePlayerSpy = jest.spyOn(matchRepositoryStub, 'updatePlayer')

    sut.handle('0:03', input)

    expect(getOpenMatchSpy).toHaveBeenCalledTimes(1)
    expect(updatePlayerSpy).toHaveBeenCalledTimes(0)
  })

  test('throw MalformedInputError if input is empty', () => {
    const { sut } = makeSut()
    const input = ''

    const actual = () => { sut.handle('0:03', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("throw MalformedInputError if there's no player id", () => {
    const { sut } = makeSut()
    const input = 'anything but a number'

    const actual = () => { sut.handle('0:03', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('set joinedAt to player successfully', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = '2'

    const serverTime = '0:03'

    jest.spyOn(matchRepositoryStub, 'getPlayer').mockReturnValueOnce(
      new Player({
        inGameId: 2, nickname: 'player name', team: TEAMS.TEAM_FREE
      }))

    const spied = jest.spyOn(matchRepositoryStub, 'updatePlayer')

    sut.handle(serverTime, input)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(2, { joinedAt: serverTime })
  })
})
