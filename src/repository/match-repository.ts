import {
  type AddPlayerProtocol,
  type GetOpenMatchProtocol,
  type GetPlayerProtocol,
  type CloseMatchProtocol,
  type CreateMatchProtocol,
  type AddKillProtocol,
  type AddSuicideProtocol
} from '../data/protocols'
import { type UpdatePlayerProtocol } from '../data/protocols/match/update-player'
import { Match, type MeanOfDeath, Player, type PlayerInGameId, type MatchSettings, type PlayerInfo } from '../domain/models'

export class MatchRepository implements
  CreateMatchProtocol,
  CloseMatchProtocol,
  GetOpenMatchProtocol,
  GetPlayerProtocol,
  AddPlayerProtocol,
  UpdatePlayerProtocol,
  AddKillProtocol,
  AddSuicideProtocol {
  matches: Match[] = []

  addSuicide (victimId: PlayerInGameId, killerId: PlayerInGameId, mod: MeanOfDeath, serverTime?: string): void {
    const match = this.matches.at(-1)
    if (!match) return

    match.totalKills += 1

    const victim = this.getPlayer(victimId)
    if (!victim) return

    victim.suicides.push([killerId, mod])
  }

  addKill (killerId: PlayerInGameId, victimId: PlayerInGameId, mod: MeanOfDeath, serverTime?: string): void {
    const match = this.matches.at(-1)
    if (!match) return

    match.totalKills += 1

    const killer = this.getPlayer(killerId)
    if (!killer) return

    killer.kills.push([victimId, mod])
  }

  updatePlayer (id: number, data: Partial<PlayerInfo & { joinedAt: string }>): void {
    const match = this.matches.at(-1)
    const player = match?.players.find(({ inGameId }) => id === inGameId)

    if (!player) return

    for (const entry of Object.entries(data)) {
      const [key, value] = entry as [keyof Player, any]
      if (key === 'nickname') player.nickname = value
      else if (key === 'team') player.team = value
      else if (key === 'joinedAt') player.joinedAt = value
    }
  }

  addPlayer (id: number, info: PlayerInfo): void {
    const player = new Player({
      inGameId: id,
      nickname: info.nickname,
      team: info.team
    })

    const match = this.matches.at(-1)
    match?.players.push(player)
  }

  getPlayer (id: number): Player | null {
    const match = this.matches.at(-1)
    const player = match?.players.find(({ inGameId }) => id === inGameId)

    if (!player) return null
    return player
  }

  getOpenMatch (): Match | null {
    const lastMatch = this.matches.at(-1)
    if (!lastMatch || !lastMatch.isOpen) return null

    return lastMatch
  }

  createMatch (createdAt: string, settings: MatchSettings): void {
    const match = new Match(createdAt, settings)
    this.matches.push(match)
  }

  closeLastMatch (serverTime: string, reason?: string): void {
    const lastMatch = this.matches.at(-1)
    if (!lastMatch) return

    lastMatch.endedAt = serverTime
    lastMatch.endReason = reason
    lastMatch.isOpen = false
  }
}
