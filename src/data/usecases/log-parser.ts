import { type GameEvent, type Match } from '../../domain/models'
import { type GameEventHandler } from '../../domain/usecases'
import { GAME_EVENTS } from '../../util/constants'

interface ParseServerLog {
  parse: (serverLog: string) => Match[]
}

export class LogParser implements ParseServerLog {
  constructor (private readonly eventHandlers: Record<GameEvent, GameEventHandler>) {}

  // TODO?: catch errors? inside for loop?
  parse (serverLog: string): Match[] {
    if (typeof serverLog !== 'string' || !serverLog) return []

    const lines = serverLog.split('\n')

    const splitter = ': '
    for (const line of lines) {
      const [serverTimeAndEvent, rest] = line.trim().split(splitter)
      const [serverTime, eventNameColon] = serverTimeAndEvent.split(' ')

      const eventName = eventNameColon.replace(':', '') as GameEvent // 'Shutdown:' would still have colon after 1st split

      if (!eventName || !GAME_EVENTS.includes(eventName)) continue

      this.eventHandlers[eventName].handle(serverTime, rest)
    }

    // TODO: return Match reports
    return []
  }
}
