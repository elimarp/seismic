import { type PlayerInfo, type RawPlayerInfo } from '../../../domain/models/player/player-info'
import { MalformedInputError, type GameEventHandler } from '../../../domain/usecases'
import { splitStringAtIndex } from '../../../util/string/split-at-index'
import { parseBackslashDelimitedStringToObject, parseNumberStringToNumber } from '../../../util/transformers'
import { type GetOpenMatchProtocol, type AddPlayerProtocol } from '../../protocols'
import { type GetPlayerProtocol } from '../../protocols/match/get-player'

export class ClientUserInfoChangedEventHandler implements GameEventHandler {
  constructor (
    private readonly getOpenMatchRepository: GetOpenMatchProtocol,
    private readonly getPlayerRepository: GetPlayerProtocol,
    private readonly addPlayerRepository: AddPlayerProtocol
  ) {}

  handle (_serverTime: string, data?: string): void {
    if (!data) throw new MalformedInputError()

    const currentMatch = this.getOpenMatchRepository.getOpenMatch()
    if (!currentMatch) return

    const splitIndex = data.indexOf(' ')

    const [playerIdStr, rawPlayerInfoStr] = splitStringAtIndex(data, splitIndex)

    const rawPlayerInfo = parseBackslashDelimitedStringToObject(rawPlayerInfoStr)
    const playerId = parseNumberStringToNumber(playerIdStr)

    if (!playerId) throw new MalformedInputError()

    const playerInfo = this.parsePlayerInfo(rawPlayerInfo)

    const player = this.getPlayerRepository.getPlayer(playerId)
    if (player) throw new MalformedInputError()

    this.addPlayerRepository.addPlayer(playerId, playerInfo)
  }

  private parsePlayerInfo (raw: Partial<RawPlayerInfo>): PlayerInfo {
    if (!raw || typeof raw !== 'object' || !raw.n || !raw.t) {
      throw new MalformedInputError()
    }

    return {
      nickname: String(raw.n),
      team: parseNumberStringToNumber(raw.t)
    }
  }
}
