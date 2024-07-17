import { Player, type GameMatch } from '../../../domain/models'
import { MalformedInputError, type GameEventHandler } from '../../../domain/usecases'
import { parseNumberStringToNumber } from '../../../util/transformers'

export class ClientConnectEventHandler implements GameEventHandler {
  handle (matches: GameMatch[], matchTime: string, data?: string): void {
    if (!data) throw new MalformedInputError()
    const currentMatch = matches.at(-1)
    if (!currentMatch || !currentMatch.isOpen) return

    const playerId = parseNumberStringToNumber(data)
    if (!playerId) throw new MalformedInputError()

    const isDuplicate = currentMatch.players.find(({ inGameId }) => inGameId === playerId)
    if (isDuplicate) return

    currentMatch.players.push(new Player(playerId))
  }
}
