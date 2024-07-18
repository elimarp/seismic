import { type Player } from '../player'
import { type MatchSettings } from './match-settings'

export type MeanOfDeath = number
export type PlayerInGameId = number

export class Match {
  isOpen: boolean = true
  players: Player[] = []
  killCount: number = 0

  constructor (
    private readonly createdAt: string,
    private readonly settings: MatchSettings
  ) {}
}
