import { ClientBeginEventHandler } from '../data/usecases/event-handlers/client-begin'
import { ClientUserInfoChangedEventHandler } from '../data/usecases/event-handlers/client-userinfo-changed'
import { ExitOrShutdownEventHandler } from '../data/usecases/event-handlers/exit-shutdown'
import { InitGameEventHandler } from '../data/usecases/event-handlers/init-game'
import { ItemEventHandler } from '../data/usecases/event-handlers/item'
import { KillEventHandler } from '../data/usecases/event-handlers/kill'
import { LogParser } from '../data/usecases/log-parser'
import { type GameEvent } from '../domain/models'
import { type GameEventHandler } from '../domain/usecases'
import { MatchRepository } from '../repository/match-repository'

const matchRepository = MatchRepository.getInstance()

const eventHandlers: Record<GameEvent, GameEventHandler> = {
  InitGame: new InitGameEventHandler(matchRepository, matchRepository),
  ClientUserinfoChanged: new ClientUserInfoChangedEventHandler(matchRepository, matchRepository, matchRepository, matchRepository),
  ClientBegin: new ClientBeginEventHandler(matchRepository, matchRepository, matchRepository),
  Item: new ItemEventHandler(matchRepository, matchRepository, matchRepository),
  Exit: new ExitOrShutdownEventHandler(matchRepository),
  ShutdownGame: new ExitOrShutdownEventHandler(matchRepository),
  Kill: new KillEventHandler(matchRepository, matchRepository, matchRepository, matchRepository)
}

export const makeLogParser = () => {
  return new LogParser(eventHandlers, matchRepository)
}
