import { makeCaptureLimit, makeFragLimit, makeGameType, makeMapName, makeTimeLimit } from '../../../../test/utils/factories'
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
  const captureLimit = makeCaptureLimit()
  const fragLimit = makeFragLimit()
  const gameType = makeGameType()
  const mapName = makeMapName()
  const timeLimit = makeTimeLimit()

  return {
    input: `\\capturelimit\\${captureLimit}\\timelimit\\${timeLimit}\\fraglimit\\${fragLimit}\\` +
      `g_gametype\\${gameType}\\mapname\\${mapName}\\gamename\\baseq3\\g_needpass\\0`,
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
