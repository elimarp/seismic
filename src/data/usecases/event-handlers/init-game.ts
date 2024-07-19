import { type MatchSettings, type RawMatchSettings } from '../../../domain/models'
import { MalformedInputError } from '../../../domain/usecases/exceptions/malformed-input-error'
import { type GameEventHandler } from '../../../domain/usecases/game-event-handler'
import { parseBackslashDelimitedStringToObject, parseNumberStringToNumber } from '../../../util/transformers'
import { type CloseMatchProtocol, type CreateMatchProtocol } from '../../protocols'

export class InitGameEventHandler implements GameEventHandler {
  constructor (
    private readonly createMatchRepository: CreateMatchProtocol,
    private readonly closeMatchRepository: CloseMatchProtocol
  ) {}

  handle (serverTime: string, data?: string): void {
    if (!data) throw new MalformedInputError()

    this.closeMatchRepository.closeLastMatch(serverTime, data)

    const rawMatchSettings = parseBackslashDelimitedStringToObject(data)
    const matchSettings = this.parseServerData(rawMatchSettings)

    this.createMatchRepository.createMatch(serverTime, matchSettings)
  }

  private parseServerData (raw: RawMatchSettings): MatchSettings {
    const settings: MatchSettings = {}
    if (!raw || typeof raw !== 'object') {
      return settings
    }

    if (raw.capturelimit) settings.captureLimit = parseNumberStringToNumber(raw.capturelimit)
    if (raw.fraglimit) settings.fragLimit = parseNumberStringToNumber(raw.fraglimit)
    if (raw.g_gametype) settings.gameType = parseNumberStringToNumber(raw.g_gametype)
    if (raw.mapname) settings.mapName = String(raw.mapname)
    if (raw.timelimit) settings.timeLimit = parseNumberStringToNumber(raw.timelimit)

    return settings
  }
}
