import { type Player } from '../player'
import { World } from '../world'
import { type MatchSettings } from './match-settings'

export class GameMatch {
  isOpen: boolean = true
  players: Player[] = []

  private readonly world: World = new World()

  constructor (public readonly settings: MatchSettings) {}
}
