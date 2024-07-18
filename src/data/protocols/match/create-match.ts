import { type MatchSettings } from '../../../domain/models'

export interface CreateMatchProtocol {
  createMatch(createdAt: string, settings: MatchSettings): void
}
