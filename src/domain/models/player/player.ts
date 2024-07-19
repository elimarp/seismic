import { type MeanOfDeath, type PlayerInGameId } from '../match'

export class Player {
  inGameId: PlayerInGameId
  nickname: string
  team: number
  joinedAt?: string
  items: { name: string, collectedAt: string }[] = []

  kills: [PlayerInGameId, MeanOfDeath][] = []
  suicides: [PlayerInGameId, MeanOfDeath][] = []
  // TODO?: Does disconnecting count as suicide, like in Counter-Strike?

  constructor ({ inGameId, nickname, team }: Pick<Player, 'inGameId' | 'nickname' | 'team'>) {
    this.inGameId = inGameId
    this.nickname = nickname
    this.team = team
  }

  getScore () {
    return this.kills.length - this.suicides.length
  }
}
