import { type MeanOfDeath, type PlayerInGameId } from '../../../domain/models'

export interface AddSuicideProtocol {
  addSuicide(victimId: PlayerInGameId, killerId: PlayerInGameId, mod: MeanOfDeath, serverTime?: string): void
}
