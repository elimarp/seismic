import { type Player } from '../../../domain/models'

export interface GetPlayerProtocol {
  getPlayer(id: number): Player | null
}
