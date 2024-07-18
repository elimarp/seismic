import { type GameMatch } from '../../../domain/models'
import { MalformedInputError, type GameEventHandler } from '../../../domain/usecases'
import { parseNumberStringToNumber } from '../../../util/transformers'

export class ItemEventHandler implements GameEventHandler {
  handle (matches: GameMatch[], matchTime: string, data?: string): void {
    if (!data) throw new MalformedInputError()
    const currentMatch = matches.at(-1)
    if (!currentMatch || !currentMatch.isOpen) return

    const [playerIdStr, item] = data.split(' ')

    const playerId = parseNumberStringToNumber(playerIdStr)
    if (!playerId) throw new MalformedInputError()

    const player = currentMatch.players.find(({ inGameId }) => inGameId === playerId)
    if (!player) throw new MalformedInputError()

    player.items.push({
      name: item,
      collectedAt: matchTime
    })
  }
}
