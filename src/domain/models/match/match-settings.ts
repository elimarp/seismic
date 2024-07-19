export type MatchSettings = {
  captureLimit?: number
  timeLimit?: number
  fragLimit?: number
  gameType: number
  mapName?: string
}

export type RawMatchSettings = {
  capturelimit?: string
  g_maxGameClients?: string
  timelimit?: string
  fraglimit?: string
  dmflags?: string
  bot_minplayers?: string
  sv_allowDownload?: string
  sv_maxclients?: string
  sv_privateClients?: string
  g_gametype?: string
  sv_hostname?: string
  sv_minRate?: string
  sv_maxRate?: string
  sv_minPing?: string
  sv_maxPing?: string
  sv_floodProtect?: string
  version?: string
  protocol?: string
  mapname?: string
  gamename?: string
  g_needpass?: string
}
