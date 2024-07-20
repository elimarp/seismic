import { type GameEventHandler } from '../../../domain/usecases'
import { type CloseMatchProtocol } from '../../protocols'

export class ExitOrShutdownEventHandler implements GameEventHandler {
  constructor (
    private readonly closeMatchRepository: CloseMatchProtocol
  ) {}

  handle (serverTime: string, data?: string): void {
    this.closeMatchRepository.closeLastMatch(serverTime, data ?? 'Suddenly shutdown')
  }
}
