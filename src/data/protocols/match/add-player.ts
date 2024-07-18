import { type PlayerInfo } from '../../../domain/models'

export interface AddPlayerProtocol {
  addPlayer(id: number, info: PlayerInfo): void
}
