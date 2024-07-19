import { faker } from '@faker-js/faker'
import { Match, type MatchSettings, Player } from '../../src/domain/models'
import { TEAMS } from '../../src/util/constants'

export const makeNewGameMatch = (replacing?: MatchSettings) => {
  const capturelimit = faker.number.int({ min: 8, max: 12 })
  const fraglimit = faker.number.int({ min: 10, max: 20 })
  const gametype = faker.number.int({ min: 0, max: 4 })
  const mapname = 'q3dm17'
  const timelimit = faker.number.int({ min: 5, max: 20 })

  return new Match('0:00', {
    captureLimit: replacing?.captureLimit ?? capturelimit,
    fragLimit: replacing?.fragLimit ?? fraglimit,
    gameType: replacing?.gameType ?? gametype,
    mapName: replacing?.mapName ?? mapname,
    timeLimit: replacing?.timeLimit ?? timelimit
  })
}

export const makeNewPlayer = (id?: number, team?: number) => {
  return new Player({ inGameId: id ?? 2, nickname: faker.person.fullName(), team: team ?? TEAMS.TEAM_FREE })
}
