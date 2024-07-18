import { MalformedInputError, type GameEventHandler } from '../../../domain/usecases'
import { parseNumberStringToNumber } from '../../../util/transformers'
import { type GetOpenMatchProtocol, type GetPlayerProtocol } from '../../protocols'
import { type UpdatePlayerProtocol } from '../../protocols/match/update-player'

export class ClientBeginEventHandler implements GameEventHandler {
  constructor (
    private readonly getOpenMatchRepository: GetOpenMatchProtocol,
    private readonly getPlayerRepository: GetPlayerProtocol,
    private readonly updatePlayerRepository: UpdatePlayerProtocol
  ) {}

  handle (serverTime: string, data?: string): void {
    const currentMatch = this.getOpenMatchRepository.getOpenMatch()
    if (!currentMatch) return

    if (!data) throw new MalformedInputError()

    const playerId = parseNumberStringToNumber(data)
    if (!playerId) throw new MalformedInputError()

    const player = this.getPlayerRepository.getPlayer(playerId)
    if (!player) throw new MalformedInputError()

    this.updatePlayerRepository.updatePlayer(playerId, { joinedAt: serverTime })
  }
}
