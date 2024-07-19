import { faker } from '@faker-js/faker'
import { Match, type MatchSettings, Player } from '../../src/domain/models'
import { TEAMS } from '../../src/util/constants'

export const makeCaptureLimit = () => faker.number.int({ min: 8, max: 12 })
export const makeFragLimit = () => faker.number.int({ min: 10, max: 20 })
export const makeGameType = () => faker.number.int({ min: 0, max: 4 })
export const makeMapName = () => faker.word.noun()
export const makeTimeLimit = () => faker.number.int({ min: 0, max: 20 })

export const makeNewGameMatch = (replacing?: MatchSettings) => {
  return new Match('0:00', {
    captureLimit: replacing?.captureLimit ?? makeCaptureLimit(),
    fragLimit: replacing?.fragLimit ?? makeFragLimit(),
    gameType: replacing?.gameType ?? makeGameType(),
    mapName: replacing?.mapName ?? makeMapName(),
    timeLimit: replacing?.timeLimit ?? makeTimeLimit()
  })
}

export const makeNewPlayer = (id?: number, team?: number) => {
  return new Player({ inGameId: id ?? 2, nickname: faker.person.fullName(), team: team ?? TEAMS.TEAM_FREE })
}
