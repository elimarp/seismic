import { type GAME_EVENTS } from '../../../util/constants'

export * from './game-match'
export * from './match-settings'

export type MeanOfDeath = number
export type PlayerInGameId = number

// TODO: shouldn't be here
export type GameEvent = typeof GAME_EVENTS[number]
