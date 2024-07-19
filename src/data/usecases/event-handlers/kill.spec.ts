import { makeNewGameMatch, makeNewPlayer } from '../../../../test/utils/factories'
import { MEANS_OF_DEATH, type Match, type MeanOfDeath, type Player, type PlayerInGameId } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases'
import { WORLD_ID } from '../../../util/constants'
import { type AddKillProtocol, type GetOpenMatchProtocol, type GetPlayerProtocol } from '../../protocols'
import { type AddSuicideProtocol } from '../../protocols/match/add-suicide'
import { KillEventHandler } from './kill'

const makeInput = (killerId: string, victimId: string, mod: MEANS_OF_DEATH) => {
  return `${killerId} ${victimId} ${mod}: killerName killed victimName by MOD_ANYTHING`
}

class MatchRepositoryStub implements GetOpenMatchProtocol, GetPlayerProtocol, AddKillProtocol, AddSuicideProtocol {
  addSuicide (victimId: PlayerInGameId, killerId: PlayerInGameId, mod: MeanOfDeath, serverTime?: string): void {}

  addKill (killerId: PlayerInGameId, victimId: PlayerInGameId, mod: MeanOfDeath): void {}

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
    sut: new KillEventHandler(matchRepositoryStub, matchRepositoryStub, matchRepositoryStub, matchRepositoryStub),
    matchRepositoryStub
  }
}

describe('Kill Event Handler', () => {
  test('skip if last match is not open', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = 'any input'

    const getOpenMatchSpy = jest.spyOn(matchRepositoryStub, 'getOpenMatch')
    getOpenMatchSpy.mockReturnValueOnce(null)

    const addKillSpy = jest.spyOn(matchRepositoryStub, 'addKill')

    sut.handle('0:03', input)

    expect(getOpenMatchSpy).toHaveBeenCalledTimes(1)
    expect(addKillSpy).toHaveBeenCalledTimes(0)
  })

  test('throw MalformedInputError if input is empty', () => {
    const { sut } = makeSut()
    const input = ''

    const actual = () => { sut.handle('0:03', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('throw MalformedInputError if killerId is not a positive number', () => {
    const { sut } = makeSut()
    const input = makeInput('a', '3', MEANS_OF_DEATH.MOD_BFG)

    const actual = () => { sut.handle('0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('throw MalformedInputError if victimId is not a positive number', () => {
    const { sut } = makeSut()
    const input = makeInput('2', '0', MEANS_OF_DEATH.MOD_BFG)

    const actual = () => { sut.handle('0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("throw MalformedInputError if killer isn't found", () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput('2', '3', MEANS_OF_DEATH.MOD_BFG)

    jest.spyOn(matchRepositoryStub, 'getPlayer').mockReturnValueOnce(null)

    const actual = () => { sut.handle('0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("throw MalformedInputError if victim isn't found", () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput('2', '3', MEANS_OF_DEATH.MOD_BFG)

    jest.spyOn(matchRepositoryStub, 'getPlayer').mockImplementation((id) => id === 2 ? makeNewPlayer() : null)

    const actual = () => { sut.handle('0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("throw MalformedInputError if MOD isn't listed", () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput('2', '3', 777 as MEANS_OF_DEATH)

    jest.spyOn(matchRepositoryStub, 'getPlayer').mockImplementationOnce(() => makeNewPlayer())

    const actual = () => { sut.handle('0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('ensure addSuicide is called if killer is world', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput(String(WORLD_ID), '3', MEANS_OF_DEATH.MOD_TRIGGER_HURT)

    const serverTime = '0:05'
    const spied = jest.spyOn(matchRepositoryStub, 'addSuicide')

    sut.handle(serverTime, input)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(3, WORLD_ID, MEANS_OF_DEATH.MOD_TRIGGER_HURT, serverTime)
  })

  test('ensure addSuicide is called if victim is killer', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput('2', '2', MEANS_OF_DEATH.MOD_ROCKET_SPLASH)

    const serverTime = '0:05'
    const spied = jest.spyOn(matchRepositoryStub, 'addSuicide')

    sut.handle(serverTime, input)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(2, 2, MEANS_OF_DEATH.MOD_ROCKET_SPLASH, serverTime)
  })

  test("ensure addKill is called correctly if it's a legit kill", () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput('2', '3', MEANS_OF_DEATH.MOD_BFG)

    const serverTime = '0:05'
    const spied = jest.spyOn(matchRepositoryStub, 'addKill')

    sut.handle(serverTime, input)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(2, 3, MEANS_OF_DEATH.MOD_BFG, serverTime)
  })
})
