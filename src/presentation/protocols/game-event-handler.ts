import { type GameMatch } from '../../domain/models'

export interface GameEventHandler {
  handle(matches: GameMatch[], matchTime: string, data?: string): void
}
