import { WORLD_ID } from '../../../util/constants'
import { type Player } from '../player'
import { type MatchSettings } from './match-settings'

export type MeanOfDeath = number
export type PlayerInGameId = number

export class Match {
  isOpen: boolean = true
  players: Player[] = []
  totalKills: number = 0
  worldId = WORLD_ID

  endReason?: string
  endedAt?: string

  constructor (
    private readonly createdAt: string,
    private readonly settings: MatchSettings
  ) {}
}
