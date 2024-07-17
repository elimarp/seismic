import { type GameEvent, type GameMatch } from '../domain/models'
import { GAME_EVENTS } from '../util/constants'
import { type GameEventHandler } from '../domain/usecases/game-event-handler'

// TODO: rethink this (use controllers |  move LogParser class | call it controller)
interface ParseServerLog {
  parse: (serverLog: string) => GameMatch[]
}

export class LogParser implements ParseServerLog {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private matches: GameMatch[] = []

  constructor (private readonly eventHandlers: Record<GameEvent, GameEventHandler>) {
  }

  // TODO?: catch errors? inside for loop?
  parse (serverLog: string): GameMatch[] {
    if (typeof serverLog !== 'string' || !serverLog) return []

    const lines = serverLog.split('\n')

    const splitter = ': '
    for (const line of lines) {
      const [matchTimeAndEvent, rest] = line.trim().split(splitter)
      const [matchTime, eventName] = matchTimeAndEvent.split(' ') as [string, GameEvent]

      if (!eventName || !GAME_EVENTS.includes(eventName)) continue

      this.eventHandlers[eventName].handle(this.matches, matchTime, rest)
    }

    return this.matches
  }
}
