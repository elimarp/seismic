import { type GameMatch } from '../../../domain/models'
import { MalformedInputError, type GameEventHandler } from '../../../domain/usecases'
import { parseNumberStringToNumber } from '../../../util/transformers'

export class ClientBeginEventHandler implements GameEventHandler {
  handle (matches: GameMatch[], matchTime: string, data?: string): void {
    const currentMatch = matches.at(-1)
    if (!currentMatch || !currentMatch.isOpen) return
    if (!data) throw new MalformedInputError()
    const playerId = parseNumberStringToNumber(data)

    if (!playerId) throw new MalformedInputError()
    const player = currentMatch.players.find(({ inGameId }) => inGameId === playerId)
    if (!player) throw new MalformedInputError()

    player.joinedAt = matchTime
  }
}
