import { makeIgnorableEventLog, makeNewGameMatch, makeValidEventLog, makeValidMatch } from '../../test/utils/factories'
import { type GameEvent, Match } from '../domain/models'
import { type GameEventHandler } from '../domain/usecases'
import { LogParser } from './log-parser'

class AnyEventHandlerStub implements GameEventHandler {
  handle (serverTime: string, data?: string) { }
}

const makeSut = () => {
  const eventHandlers: Record<GameEvent, GameEventHandler> = {
    InitGame: new AnyEventHandlerStub(),
    ClientBegin: new AnyEventHandlerStub(),
    ClientUserinfoChanged: new AnyEventHandlerStub(),
    Exit: new AnyEventHandlerStub(),
    Item: new AnyEventHandlerStub(),
    Kill: new AnyEventHandlerStub(),
    ShutdownGame: new AnyEventHandlerStub()
  }

  return {
    sut: new LogParser(eventHandlers),
    eventHandlers
  }
}

describe('Log Parser', () => {
  test('return empty array if input is not a string', () => {
    const { sut } = makeSut()
    const input = {}
    const expected: [] = []
    const actual = sut.parse(input as unknown as string)

    expect(actual).toStrictEqual(expected)
  })

  test('return empty array if input is not truthy', () => {
    const { sut } = makeSut()
    const input = ''
    const expected: [] = []
    const actual = sut.parse(input)

    expect(actual).toStrictEqual(expected)
  })

  test('ensure the right eventHandler is being called', () => {
    const { sut, eventHandlers } = makeSut()
    const [eventName, eventLog] = makeValidEventLog()
    const spied = jest.spyOn(eventHandlers[eventName], 'handle')

    sut.parse(eventLog)
    const rest = eventName === 'ShutdownGame' ? undefined : expect.any(String)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith('1:00', rest)
  })

  test('ensure not-listed events are ignored', () => {
    const { sut, eventHandlers } = makeSut()
    const log = makeIgnorableEventLog()

    for (const handler of Object.values(eventHandlers)) {
      expect(jest.spyOn(handler, 'handle')).toHaveBeenCalledTimes(0)
    }

    sut.parse(log)
  })

  // TODO: test log parser success case
  // test('return Match[] successfully', () => {
  // })
})
