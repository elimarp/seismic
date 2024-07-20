import { type Match, type GameEvent } from '../../domain/models'
import { type GameEventHandler } from '../../domain/usecases'

import * as fs from 'fs'
import * as readline from 'readline'
import { GAME_EVENTS } from '../../util/constants'
import { type GetMatchesProtocol } from '../protocols/match/get-matches'

interface ParseServerLog {
  parse: (logFilepath: string) => Promise<Match[]>
}

export class LogParser implements ParseServerLog {
  private readonly eventLogSplitter = ': '

  constructor (
    private readonly eventHandlers: Record<GameEvent, GameEventHandler>,
    private readonly getMatchesRepository: GetMatchesProtocol
  ) {}

  async parse (filePath: string): Promise<Match[]> {
    return await new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath, { encoding: 'utf8' })

      const readInterface = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
      })

      readStream.on('error', (error) => { reject(error) })
      readStream.on('end', () => { resolve(this.getMatchesRepository.getMatches()) })
      readInterface.on('line', (line: string) => { this.readLine(line) })
    })
  }

  private readLine (line: string) {
    try {
      const [serverTimeAndEvent, rest] = line.trim().split(this.eventLogSplitter)
      const [serverTime, eventNameColon] = serverTimeAndEvent.split(' ')

      if (!eventNameColon) return

      const eventName = eventNameColon.replace(':', '') as GameEvent // 'Shutdown:' would still have colon after 1st split

      if (!GAME_EVENTS.includes(eventName)) return

      this.eventHandlers[eventName].handle(serverTime, rest)
    } catch (error) {
      console.error('failed to read line:', line)
    }
  }
}
