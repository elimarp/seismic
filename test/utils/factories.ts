import { faker } from '@faker-js/faker'
import { GameMatch, type MatchSettings, type GameEvent } from '../../src/domain/models'
import { GAME_EVENTS } from '../../src/util/constants'

export const makeIgnorableEventLog = () => '11:15 score: 20  ping: 4  client: 2 Oootsimo'

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

type MakeNewGameMatchReplacing = Partial<MatchSettings>
export const makeNewGameMatch = (replacing?: MakeNewGameMatchReplacing) => {
  const capturelimit = faker.number.int({ min: 8, max: 12 })
  const fraglimit = faker.number.int({ min: 10, max: 20 })
  const gametype = faker.number.int({ min: 0, max: 4 })
  const mapname = 'q3dm17'
  const timelimit = faker.number.int({ min: 5, max: 20 })

  return new GameMatch({
    captureLimit: replacing?.captureLimit ?? capturelimit,
    fragLimit: replacing?.fragLimit ?? fraglimit,
    gameType: replacing?.gameType ?? gametype,
    mapName: replacing?.mapName ?? mapname,
    timeLimit: replacing?.timeLimit ?? timelimit
  })
}

export const makeValidEventLog = (event?: GameEvent) => {
  if (event && GAME_EVENTS.includes(event)) {
    return events.find(([eventName]) => eventName === event)!
  }

  const randomIndex = faker.number.int({ min: 0, max: Object.keys(events).length - 1 })
  return events[randomIndex]
}

export const makeValidMatch = (): string => {
  return events.map(([_, log]) => log).join('\n')
}
