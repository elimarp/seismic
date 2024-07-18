import { MEANS_OF_DEATH } from '../../../domain/models'
import { MalformedInputError, type GameEventHandler } from '../../../domain/usecases'
import { WORLD_ID } from '../../../util/constants'
import { parseNumberStringToNumber } from '../../../util/transformers'
import { type AddKillProtocol, type AddSuicideProtocol, type GetPlayerProtocol, type GetOpenMatchProtocol } from '../../protocols'

export class KillEventHandler implements GameEventHandler {
  constructor (
    private readonly getOpenMatchRepository: GetOpenMatchProtocol,
    private readonly getPlayerRepository: GetPlayerProtocol,
    private readonly addKillRepository: AddKillProtocol,
    private readonly addSuicideRepository: AddSuicideProtocol

  ) {}

  handle (serverTime: string, data?: string): void {
    const currentMatch = this.getOpenMatchRepository.getOpenMatch()
    if (!currentMatch) return

    if (!data) throw new MalformedInputError()
    const [killerIdStr, victimIdStr, modStr] = data.split(' ')

    const killerId = parseNumberStringToNumber(killerIdStr)
    const victimId = parseNumberStringToNumber(victimIdStr)
    const mod = parseNumberStringToNumber(modStr)

    if (!killerId || !victimId) throw new MalformedInputError()
    if (!Object.values(MEANS_OF_DEATH).some((value) => value === mod)) throw new MalformedInputError()

    const killer = this.getPlayerRepository.getPlayer(killerId)
    const victim = this.getPlayerRepository.getPlayer(victimId)

    if (!victim) throw new MalformedInputError()
    if (killerId !== WORLD_ID && !killer) throw new MalformedInputError()

    if (killerId === WORLD_ID) {
      this.addSuicideRepository.addSuicide(victimId, WORLD_ID, mod, serverTime)
      return
    }

    if (killerId === victimId) {
      this.addSuicideRepository.addSuicide(victimId, killerId, mod, serverTime)
      return
    }

    this.addKillRepository.addKill(killerId, victimId, mod, serverTime)
  }
}
