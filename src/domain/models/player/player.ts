import { type MeanOfDeath, type PlayerInGameId } from '../match'

export class Player {
  public inGameId: PlayerInGameId
  private readonly kills: [PlayerInGameId, MeanOfDeath][] = []
  private readonly suicides: [PlayerInGameId, MeanOfDeath][] = []
  // TODO?: Does disconnecting count as suicide, like in Counter-Strike?

  constructor (inGameId: PlayerInGameId) {
    this.inGameId = inGameId
  }

  getScore (): number {
    // return kills.len - suicides.len
    return 0
  }
}
