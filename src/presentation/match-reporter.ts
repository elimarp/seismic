import chalk from 'chalk'
import Table from 'cli-table'
import { MEANS_OF_DEATH_NAMES, type Match, type TeamScore } from '../domain/models'
import { GAME_TYPE_NAMES, GAME_TYPES } from '../util/constants'

export type GetReportOption = 'scoreboard' | 'player-title' | 'mod'

type ScoreboardRow = {
  nickname: string
  score: number
  kills: number
  suicides: number
  team: number
  title?: string
}

type ModName = typeof MEANS_OF_DEATH_NAMES[number]
type Mods = Partial<Record<ModName, number>>

type MatchReport = {
  gameMode: string
  totalKills: number
  players: string[]
  createdAt: string
  collectedItems: number
  scoreboard?: ScoreboardRow[]
  killsByMeans?: Mods
  teamScores?: TeamScore
  endedAt?: string
  endReason?: string
}

export class MatchReporter {
  getReport (matches: Match[], ...options: GetReportOption[]): MatchReport[] {
    const reports = matches.map((match) => {
      const { gameType } = match.settings

      const scoreboard = options.includes('scoreboard')
        ? this.createScoreboard(match, options.includes('player-title'))
        : undefined

      const killsByMeans = options.includes('mod') ? this.createModBoard(match) : undefined

      const teamScores = gameType === GAME_TYPES.CaptureTheFlag || gameType === GAME_TYPES.TeamDeathMatch
        ? match.getTeamScores()
        : undefined

      const players = match.players.map(player => player.nickname)

      const collectedItems = match.players
        .map(player => player.items.length)
        .reduce((total, current) => total + current, 0)

      const matchReport: MatchReport = {
        gameMode: GAME_TYPE_NAMES[gameType],
        totalKills: match.totalKills,
        players,
        createdAt: match.createdAt,
        endedAt: match.endedAt,
        endReason: match.endReason,
        scoreboard,
        killsByMeans,
        teamScores,
        collectedItems
      }

      return matchReport
    })

    return reports
  }

  getPrettyReports (reports: MatchReport[]): string {
    let result = ''

    let matchIterator = 0
    for (const report of reports) {
      const matchTable = new Table({
        head: [chalk.green(`MATCH ${matchIterator + 1}`)]
      })

      const includeScoreboard = report.scoreboard
        ? [
            ['SCOREBOARD'],
            [this.getPrintableScoreboard(report.scoreboard)]
          ]
        : []

      const includeModTable = report.killsByMeans
        ? [
            ['Means of Death'],
            [this.getPrintableModBoard(report.killsByMeans)]
          ]
        : []

      const includeTeamScore = report.teamScores
        ? [
            [`${chalk.red(`Red: ${report.teamScores.red}`)} | ${chalk.blue(`Blue: ${report.teamScores.blue}`)}`]
          ]
        : []

      matchTable.push(
        [`${report.createdAt} - ${report.endedAt ?? '?'} (${report.endReason ?? 'Unknown reason'})`],
        [`Total Kills: ${report.totalKills}`],
        [`Players: ${report.players.join(', ')}`],
        ...includeScoreboard,
        ...includeTeamScore,
        ...includeModTable
      )

      result += `${matchTable.toString()}\n`

      matchIterator++
    }

    return result
  }

  private createModBoard (match: Match): Mods {
    const playersKillMods = match.players.map(player => {
      const playerKillMods = player.kills.map(([, mod]) => mod)
      return playerKillMods
    })

    const killMods = playersKillMods.flat()

    const modTable = killMods.reduce<Partial<Record<ModName, number>>>((accumulator, modNumber) => {
      const modName = MEANS_OF_DEATH_NAMES[modNumber]
      if (accumulator[modName]) {
        accumulator[modName]++
      } else {
        accumulator[modName] = 1
      }
      return accumulator
    }, {})

    const modTableSorted = Object.fromEntries(Object.entries(modTable).sort((a, b) => b[1] - a[1]))
    return modTableSorted
  }

  private createScoreboard (match: Match, enableTitles?: boolean): ScoreboardRow[] {
    // TODO: create more titles
    const lootingLarryIndex = enableTitles
      ? match.players.reduce(
        (returnIndex, player, currentIndex, players) => player.items.length > players[returnIndex].items.length ? currentIndex : returnIndex,
        0
      )
      : undefined

    const scoreboard = match.players.map<ScoreboardRow>((player, index) => ({
      nickname: player.nickname,
      score: player.getScore(),
      kills: player.kills.length,
      suicides: player.suicides.length,
      team: player.team,
      title: index === lootingLarryIndex ? `Looting Larry: ${player.items.length} items collected` : undefined
    })).sort((a, b) => b.score - a.score)

    return scoreboard
  }

  private getPrintableScoreboard (scoreboard: ScoreboardRow[]): string {
    const scoreboardTable = new Table({
      head: [
        chalk.grey('#'), chalk.grey('Nickname'), chalk.grey('Score'), chalk.grey('Total Kills'), chalk.grey('Suicides'), chalk.grey('Title')
      ]
    })

    const teamColors = [
      chalk.white,
      chalk.red,
      chalk.blue,
      chalk.gray
    ]
    const scoreboardPlayers = scoreboard.map((player, i) => ([
      teamColors[player.team](i + 1),
      teamColors[player.team](player.nickname),
      teamColors[player.team](player.score),
      teamColors[player.team](player.kills),
      teamColors[player.team](player.suicides),
      teamColors[player.team](player.title ?? '')
    ]))

    scoreboardTable.push(...scoreboardPlayers)

    return scoreboardTable.toString()
  }

  private getPrintableModBoard (mods: Mods): string {
    const modTable = new Table({
      head: [chalk.grey('#'), chalk.grey('MOD Name'), chalk.grey('Total Kills')]
    })

    const rows = Object.entries(mods).map(([modName, kills], i) => ([
      (i + 1).toString(),
      modName,
      kills.toString()
    ]))

    modTable.push(...rows)

    return modTable.toString()
  }
}
