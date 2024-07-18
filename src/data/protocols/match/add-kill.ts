import { type MeanOfDeath, type PlayerInGameId } from '../../../domain/models'

export interface AddKillProtocol {
  addKill(killerId: PlayerInGameId, victimId: PlayerInGameId, mod: MeanOfDeath, serverTime?: string): void
}
