/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { faker } from '@faker-js/faker'
import { InitGameEventHandler } from './init-game'
import { makeNewGameMatch } from '../../../../test/utils/factories'
import { GameMatch } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases'

const makeSut = () => {
  return {
    sut: new InitGameEventHandler()
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
  test("start new match correctly if there's no matches yet", () => {
    const { sut } = makeSut()
    const { input } = makeValidInput()

    const matches: GameMatch[] = []
    sut.handle(matches, '0:00', input)

    expect(matches[0]).toBeInstanceOf(GameMatch)
  })

  test("start new game closing last one if it's open", () => {
    const { sut } = makeSut()
    const { input } = makeValidInput()

    const matches: GameMatch[] = [makeNewGameMatch()]
    sut.handle(matches, '0:00', input)

    expect(matches[0].isOpen).toBe(false)
    expect(matches[1]).toBeInstanceOf(GameMatch)
    expect(matches[1].isOpen).toBe(true)
  })

  test('throw MalformedInputError if no game settings data', () => {
    const { sut } = makeSut()
    const input = ''

    const matches: GameMatch[] = [makeNewGameMatch()]

    const actual = () => sut.handle(matches, '0:00', input)
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('start new game with the right settings', () => {
    const { sut } = makeSut()

    const matches: GameMatch[] = []
    const { input, assertion } = makeValidInput()
    const expected = new GameMatch(assertion)

    sut.handle(matches, '0:00', input)

    expect(matches[0]).toStrictEqual(expected)
  })
})
