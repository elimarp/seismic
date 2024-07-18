import { faker } from '@faker-js/faker'
import { type MatchSettings } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases'
import { type CloseMatchProtocol, type CreateMatchProtocol } from '../../protocols'
import { InitGameEventHandler } from './init-game'

class MatchRepositoryStub implements CreateMatchProtocol, CloseMatchProtocol {
  closeLastMatch (): void {}
  createMatch (createdAt: string, settings: MatchSettings): void {}
}
const makeSut = () => {
  const matchRepositoryStub = new MatchRepositoryStub()
  return {
    sut: new InitGameEventHandler(matchRepositoryStub, matchRepositoryStub),
    matchRepositoryStub
  }
}

const makeValidInput = () => {
  // TODO: DRY
  const captureLimit = faker.number.int({ min: 8, max: 12 })
  const fragLimit = faker.number.int({ min: 10, max: 20 })
  const gameType = faker.number.int({ min: 0, max: 4 })
  const mapName = 'q3dm17'
  const timeLimit = faker.number.int({ min: 5, max: 20 })

  return {
    input: `\\capturelimit\\${captureLimit}\\g_maxGameClients\\0\\timelimit\\${timeLimit}\\fraglimit\\${fragLimit}\\` +
      'dmflags\\0\\bot_minplayers\\0\\sv_allowDownload\\0\\sv_maxclients\\16\\sv_privateClients\\2\\' +
      `g_gametype\\${gameType}\\sv_hostname\\Code Miner Server\\sv_minRate\\0\\sv_maxRate\\10000\\sv_minPing\\0` +
      '\\sv_maxPing\\0\\sv_floodProtect\\1\\version\\ioq3 1.36 linux-x86_64 Apr 12 2009\\protocol\\68\\' +
      `mapname\\${mapName}\\gamename\\baseq3\\g_needpass\\0`,
    serverTime: '0:01',
    assertion: {
      captureLimit,
      fragLimit,
      gameType,
      mapName,
      timeLimit
    }
  }
}

describe('InitGame Event Handler', () => {
  test('throw MalformedInputError if no game settings data', () => {
    const { sut } = makeSut()
    const input = ''

    const actual = () => { sut.handle('any time', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("start new match correctly if there's no matches yet", () => {
    const { sut, matchRepositoryStub } = makeSut()
    const { input, assertion, serverTime } = makeValidInput()

    const spied = jest.spyOn(matchRepositoryStub, 'createMatch')
    sut.handle(serverTime, input)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(serverTime, assertion)
  })

  test("start new game closing last one if it's open", () => {
    const { sut, matchRepositoryStub } = makeSut()
    const { input, assertion, serverTime } = makeValidInput()

    const closeLastMatchSpy = jest.spyOn(matchRepositoryStub, 'closeLastMatch')
    const createMatchSpy = jest.spyOn(matchRepositoryStub, 'createMatch')
    sut.handle(serverTime, input)

    expect(closeLastMatchSpy).toHaveBeenCalledTimes(1)
    expect(createMatchSpy).toHaveBeenCalledTimes(1)
    expect(createMatchSpy).toHaveBeenCalledWith(serverTime, assertion)
  })
})
