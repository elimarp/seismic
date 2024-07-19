export enum TEAMS {
  TEAM_FREE,
  TEAM_RED,
  TEAM_BLUE,
  TEAM_SPECTATOR,
}

export const GAME_EVENTS = [
  'InitGame',
  // 'ClientConnect',
  'ClientUserinfoChanged',
  'ClientBegin',
  // 'ClientDisconnect',
  'Exit',
  'Item',
  'Kill',
  'ShutdownGame'
] as const

export const WORLD_ID = 1022

export enum GAME_TYPES {
  FreeForAll,
  Tournament, // one on one tournament
  SinglePlayer, // single player tournament

  // team games go after this
  TeamDeathMatch,
  CaptureTheFlag,
}

export const GAME_TYPE_NAMES = [
  'Free For All',
  'Tournament',
  'Single Player',
  'Team Deathmatch',
  'Capture The Flag'
] as const
