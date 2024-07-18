import { makeNewGameMatch, makeNewPlayer } from '../../../../test/utils/factories'
import { type Match, type Player } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases'
import { type AddItemToPlayerProtocol, type GetOpenMatchProtocol, type GetPlayerProtocol } from '../../protocols'
import { ItemEventHandler } from './item'

const makeInput = (id: string) => {
  return `${id} weapon_rocketlauncher`
}

class MatchRepositoryStub implements GetOpenMatchProtocol, GetPlayerProtocol, AddItemToPlayerProtocol {
  addItem (playerId: number, itemName: string, collectedAt: string): void {}

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
    sut: new ItemEventHandler(matchRepositoryStub, matchRepositoryStub, matchRepositoryStub),
    matchRepositoryStub
  }
}

describe('Item Event Handler', () => {
  test('skip if last match is not open', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = 'any input'

    const getOpenMatchSpy = jest.spyOn(matchRepositoryStub, 'getOpenMatch')
    getOpenMatchSpy.mockReturnValueOnce(null)

    const addItemSpy = jest.spyOn(matchRepositoryStub, 'addItem')

    sut.handle('0:03', input)

    expect(getOpenMatchSpy).toHaveBeenCalledTimes(1)
    expect(addItemSpy).toHaveBeenCalledTimes(0)
  })

  test('throw MalformedInputError if input is empty', () => {
    const { sut } = makeSut()
    const input = ''

    const actual = () => { sut.handle('0:03', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('throw MalformedInputError if playerId is not a positive number', () => {
    const { sut } = makeSut()
    const input = makeInput('a')

    const actual = () => { sut.handle('0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test("throw MalformedInputError if player isn't found", () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput('3')

    jest.spyOn(matchRepositoryStub, 'getPlayer').mockReturnValueOnce(null)

    const actual = () => { sut.handle('0:04', input) }
    const expected = new MalformedInputError()

    expect(actual).toThrow(expected)
  })

  test('ensure addItem is called correctly', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = makeInput('2')

    const serverTime = '0:05'
    const spied = jest.spyOn(matchRepositoryStub, 'addItem')

    sut.handle(serverTime, input)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(2, 'weapon_rocketlauncher', serverTime)
  })
})
