import chalk from 'chalk'
import Table from 'cli-table'
import { MEANS_OF_DEATH_NAMES, type Match, type TeamScore } from '../domain/models'
import { GAME_TYPE_NAMES, GAME_TYPES } from '../util/constants'

export type GetReportOption = 'scoreboard' | '1v1' | 'player-title' | 'mod'

type ScoreboardRow = {
  nickname: string
  score: number
  kills: number
  suicides: number
  team: number
}

type ModName = typeof MEANS_OF_DEATH_NAMES[number]
type Mods = Partial<Record<ModName, number>>

type MatchReport = {
  gameMode: string
  totalKills: number
  players: string[]
  scoreboard?: ScoreboardRow[]
  killsByMeans?: Mods
  teamScores?: TeamScore
}

export class MatchReporter {
  getReport (matches: Match[], ...options: GetReportOption[]): MatchReport[] {
    const reports = matches.map((match) => {
      const { gameType } = match.settings
      const matchReport: MatchReport = {
        gameMode: GAME_TYPE_NAMES[gameType],
        totalKills: match.totalKills,
        players: match.players.map(player => player.nickname)
      }

      if (options.includes('scoreboard')) {
        matchReport.scoreboard = match.players.map<ScoreboardRow>((player) => ({
          nickname: player.nickname,
          score: player.getScore(),
          kills: player.kills.length,
          suicides: player.suicides.length,
          team: player.team
        })).sort((a, b) => b.score - a.score)
      }

      if (options.includes('mod')) {
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
        matchReport.killsByMeans = modTableSorted
      }

      if (gameType === GAME_TYPES.CaptureTheFlag || gameType === GAME_TYPES.TeamDeathMatch) {
        matchReport.teamScores = match.getTeamScores()
      }

      return matchReport
    })

    return reports
  }

  getScoreboardTable (scoreboard: ScoreboardRow[]): string {
    const scoreboardTable = new Table({
      head: [
        chalk.grey('#'), chalk.grey('Nickname'), chalk.grey('Score'), chalk.grey('Total Kills'), chalk.grey('Suicides')
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
      teamColors[player.team](player.suicides)
    ]))

    scoreboardTable.push(...scoreboardPlayers)

    return scoreboardTable.toString()
  }

  getModsTable (mods: Mods): string {
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
            [this.getScoreboardTable(report.scoreboard)]
          ]
        : []

      const includeModTable = report.killsByMeans
        ? [
            ['Means of Death'],
            [this.getModsTable(report.killsByMeans)]
          ]
        : []

      const includeTeamScore = report.teamScores
        ? [
            [`${chalk.red(`Red: ${report.teamScores.red}`)} | ${chalk.blue(`Blue: ${report.teamScores.blue}`)}`]
          ]
        : []

      matchTable.push(
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
}
