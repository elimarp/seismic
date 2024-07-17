import { faker } from '@faker-js/faker'
import { GameMatch, type GameEvent } from '../domain/models'
import { GameTypes } from '../utils/constants'
import { LogParser } from './log-parser'
import { type GameEventHandler } from './protocols/game-event-handler'

class AnyEventHandlerStub implements GameEventHandler {
  handle (matches: GameMatch[], matchTime: string, data?: string) { }
}

const makeSut = () => {
  const eventHandlers: Record<GameEvent, GameEventHandler> = {
    InitGame: new AnyEventHandlerStub(),
    ClientBegin: new AnyEventHandlerStub(),
    ClientConnect: new AnyEventHandlerStub(),
    // ClientDisconnect: new AnyEventHandlerStub(),
    ClientUserinfoChanged: new AnyEventHandlerStub(),
    Exit: new AnyEventHandlerStub(),
    Item: new AnyEventHandlerStub(),
    Kill: new AnyEventHandlerStub(),
    'ShutdownGame:': new AnyEventHandlerStub()
  }

  return {
    sut: new LogParser(eventHandlers),
    eventHandlers
  }
}

const makeIgnorableEventLog = () => '11:15 score: 20  ping: 4  client: 2 Oootsimo'

const events: [GameEvent, string][] = [
  ['InitGame', '1:00 InitGame: \\capturelimit\\8\\g_maxGameClients\\0\\timelimit\\15\\fraglimit\\20\\dmflags\\0\\bot_minplayers\\0\\sv_allowDownload\\0\\sv_maxclients\\16\\sv_privateClients\\2\\g_gametype\\0\\sv_hostname\\Code Miner Server\\sv_minRate\\0\\sv_maxRate\\10000\\sv_minPing\\0\\sv_maxPing\\0\\sv_floodProtect\\1\\version\\ioq3 1.36 linux-x86_64 Apr 12 2009\\protocol\\68\\mapname\\q3dm17\\gamename\\baseq3\\g_needpass\\0'],
  ['ClientConnect', '1:00 ClientConnect: 2'],
  ['ClientUserinfoChanged', '1:00 ClientUserinfoChanged: 2 n\\Oootsimo\\t\\0\\model\\razor/id\\hmodel\\razor/id\\g_redteam\\\\g_blueteam\\\\c1\\3\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl\\0'],
  ['ClientBegin', '1:00 ClientBegin: 2'],
  ['Item', '1:00 Item: 2 ammo_rockets'],
  ['Kill', '1:00 Kill: 1022 2 19: <world> killed Zeh by MOD_FALLING'],
  ['Exit', '1:00 Exit: Fraglimit hit.'],
  ['ShutdownGame:', '1:00 ShutdownGame:']
]

const makeValidEvent = () => {
  const randomIndex = faker.number.int({ min: 0, max: Object.keys(events).length - 1 })
  return events[randomIndex]
}

const makeValidMatch = (): string => {
  return events.map(([_, log]) => log).join('\n')
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
    const [eventName, eventLog] = makeValidEvent()
    const spied = jest.spyOn(eventHandlers[eventName], 'handle')

    sut.parse(eventLog)
    const rest = eventName === 'ShutdownGame:' ? undefined : expect.any(String)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith([], '1:00', rest)
  })

  test('ensure not-listed events are ignored', () => {
    const { sut, eventHandlers } = makeSut()
    const log = makeIgnorableEventLog()

    for (const handler of Object.values(eventHandlers)) {
      expect(jest.spyOn(handler, 'handle')).toHaveBeenCalledTimes(0)
    }

    sut.parse(log)
  })

  test('return Match[] successfully', () => {
    const { sut, eventHandlers } = makeSut()
    const input = makeValidMatch()

    jest.spyOn(eventHandlers.InitGame, 'handle').mockImplementationOnce((matches, matchTime, data) => {
      matches.push(new GameMatch({
        capturelimit: 8,
        fraglimit: 20,
        gametype: GameTypes.FreeForAll,
        mapname: 'q3dm17',
        timelimit: 15
      }))
    })

    const actual = sut.parse(input)

    expect(actual[0]).toBeInstanceOf(GameMatch)
  })
})
