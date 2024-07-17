import { type MeanOfDeath, type PlayerInGameId } from './match'

export class World {
  public readonly inGameId: number = 1022 // as defined at game source code
  private readonly kills: [PlayerInGameId, MeanOfDeath][] = []
}
