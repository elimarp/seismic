import { type Match } from '../../../domain/models'

export interface GetMatchesProtocol {
  getMatches(): Match[]
}
