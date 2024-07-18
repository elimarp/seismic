import { MalformedInputError, type GameEventHandler } from '../../../domain/usecases'
import { parseNumberStringToNumber } from '../../../util/transformers'
import { type AddItemToPlayerProtocol, type GetOpenMatchProtocol, type GetPlayerProtocol } from '../../protocols'

export class ItemEventHandler implements GameEventHandler {
  constructor (
    private readonly getOpenMatchRepository: GetOpenMatchProtocol,
    private readonly getPlayerRepository: GetPlayerProtocol,
    private readonly addItemRepository: AddItemToPlayerProtocol
  ) {}

  handle (serverTime: string, data?: string): void {
    const currentMatch = this.getOpenMatchRepository.getOpenMatch()
    if (!currentMatch) return

    if (!data) throw new MalformedInputError()

    const [playerIdStr, item] = data.split(' ')

    const playerId = parseNumberStringToNumber(playerIdStr)
    if (!playerId) throw new MalformedInputError()

    const player = this.getPlayerRepository.getPlayer(playerId)
    if (!player) throw new MalformedInputError()

    this.addItemRepository.addItem(playerId, item, serverTime)
  }
}
