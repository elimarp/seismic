import { type GameMatch } from '../../../domain/models'
import { type PlayerInfo, type RawPlayerInfo } from '../../../domain/models/player/player-info'
import { MalformedInputError, type GameEventHandler } from '../../../domain/usecases'
import { splitStringAtIndex } from '../../../util/string/split-at-index'
import { parseBackslashDelimitedStringToObject, parseNumberStringToNumber } from '../../../util/transformers'

export class ClientUserInfoChangedEventHandler implements GameEventHandler {
  handle (matches: GameMatch[], matchTime: string, data?: string): void {
    if (!data) throw new MalformedInputError()
    const currentMatch = matches.at(-1)
    if (!currentMatch || !currentMatch.isOpen) return

    const splitIndex = data.indexOf(' ')

    const [playerIdStr, rawPlayerInfoStr] = splitStringAtIndex(data, splitIndex)
    console.log({ playerIdStr, rawPlayerInfoStr })

    const rawPlayerInfo = parseBackslashDelimitedStringToObject(rawPlayerInfoStr)
    const playerId = parseNumberStringToNumber(playerIdStr)

    if (!playerId) throw new MalformedInputError()

    const playerInfo = this.parsePlayerInfo(rawPlayerInfo)

    const player = currentMatch.players.find(({ inGameId }) => inGameId === playerId)
    if (!player) throw new MalformedInputError()

    player.nickname = playerInfo.nickname
    player.team = playerInfo.team
  }

  // TODO?: Interface Segregation
  // TODO?: inject parseNumberStringToNumber?
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
