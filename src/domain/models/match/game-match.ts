import { type PlayerInGameId } from '.'
import { type Player } from '../player'
import { World } from '../world'
import { type MatchSettings } from './match-settings'

export class GameMatch {
  public isOpen: boolean = true
  private readonly world: World = new World()
  private readonly players: Player[] = []

  constructor (public readonly settings: MatchSettings) {}

  addPlayer (id: PlayerInGameId): void {
    throw new Error('Method not implemented.')
  }
}
