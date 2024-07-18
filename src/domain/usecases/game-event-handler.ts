export interface GameEventHandler {
  handle(serverTime: string, data?: string): void
}
