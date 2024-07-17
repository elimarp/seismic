import { GameMatch, type MatchSettings, type RawMatchSettings } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases/exceptions/malformed-input-error'
import { type GameEventHandler } from '../../../domain/usecases/game-event-handler'
import { parseBackslashDelimitedStringToObject, parseNumberStringToNumber } from '../../../util/transformers'

export class InitGame implements GameEventHandler {
  handle (matches: GameMatch[], matchTime: string, data?: string): void {
    if (!data) throw new MalformedInputError()

    if (matches.at(-1) && matches.at(-1)?.isOpen) {
      matches.at(-1)!.isOpen = false
    }

    // TODO?: inject parseBackslashDelimitedStringToObject instead?
    const rawMatchSettings = parseBackslashDelimitedStringToObject(data)
    const matchSettings = this.parseServerData(rawMatchSettings)

    matches.push(new GameMatch(matchSettings))
  }

  // TODO?: Interface Segregation
  private parseServerData (raw: RawMatchSettings): MatchSettings {
    const settings: MatchSettings = {}
    if (!raw || typeof raw !== 'object') {
      return settings
    }

    // TODO?: inject parseNumberStringToNumber?
    if (raw.capturelimit) settings.captureLimit = parseNumberStringToNumber(raw.capturelimit)
    if (raw.fraglimit) settings.fragLimit = parseNumberStringToNumber(raw.fraglimit)
    if (raw.g_gametype) settings.gameType = parseNumberStringToNumber(raw.g_gametype)
    if (raw.mapname) settings.mapName = String(raw.mapname)
    if (raw.timelimit) settings.timeLimit = parseNumberStringToNumber(raw.timelimit)

    return settings
  }
}
