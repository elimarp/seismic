export interface AddItemToPlayerProtocol {
  addItem(playerId: number, itemName: string, collectedAt: string): void
}
