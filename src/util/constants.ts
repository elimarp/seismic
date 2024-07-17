export enum TEAMS {
  TEAM_FREE,
  TEAM_RED,
  TEAM_BLUE,
  TEAM_SPECTATOR,
}

export const GAME_EVENTS = [
  'InitGame',
  'ClientConnect',
  'ClientUserinfoChanged',
  'ClientBegin',
  // 'ClientDisconnect',
  'Exit',
  'Item',
  'Kill',
  'ShutdownGame:'
] as const

export enum GAME_TYPES {
  FreeForAll,
  Tournament, // one on one tournament
  SinglePlayer, // single player tournament

  // team games go after this
  TeamDeathMatch,
  CaptureTheFlag,
}
