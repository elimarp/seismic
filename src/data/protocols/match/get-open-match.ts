import { type Match } from '../../../domain/models'

export interface GetOpenMatchProtocol {
  getOpenMatch(): Match | null
}
