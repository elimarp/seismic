import { type PlayerInGameId } from '.'
import { type Player } from '../player'
import { World } from '../world'
import { type MatchSettings } from './match-settings'

export class GameMatch {
  private readonly world: World = new World()
  private readonly players: Player[] = []

  constructor (private readonly settings: MatchSettings) {}

  addPlayer (id: PlayerInGameId): void {
    throw new Error('Method not implemented.')
  }
}
