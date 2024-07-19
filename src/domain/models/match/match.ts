import { TEAMS } from '../../../util/constants'
import { type Player } from '../player'
import { type MatchSettings } from './match-settings'

export type MeanOfDeath = number
export type PlayerInGameId = number
export type TeamScore = { red: number, blue: number }

export class Match {
  isOpen: boolean = true
  players: Player[] = []
  totalKills: number = 0

  endReason?: string
  endedAt?: string

  constructor (
    public readonly createdAt: string,
    public readonly settings: MatchSettings
  ) { }

  getTeamScores (): TeamScore {
    return this.players.reduce<TeamScore>((acc, player) => {
      if (player.team === TEAMS.TEAM_RED) {
        acc.red += player.getScore()
        return acc
      }
      if (player.team === TEAMS.TEAM_BLUE) {
        acc.blue += player.getScore()
        return acc
      }
      return acc
    }, { red: 0, blue: 0 })
  }
}
