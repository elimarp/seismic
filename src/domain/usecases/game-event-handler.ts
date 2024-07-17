import { type GameMatch } from '../models'

export interface GameEventHandler {
  handle(matches: GameMatch[], matchTime: string, data?: string): void
}
