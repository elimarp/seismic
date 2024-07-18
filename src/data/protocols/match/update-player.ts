import { type PlayerInfo } from '../../../domain/models'

export interface UpdatePlayerProtocol {
  updatePlayer(id: number, data: Partial<PlayerInfo & { joinedAt: string }>): void
}
