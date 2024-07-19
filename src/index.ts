import select, { Separator } from '@inquirer/select'
import { existsSync } from 'fs'
import { mkdir, readdir, writeFile } from 'fs/promises'
import * as path from 'path'
import { select as multipleSelect } from 'inquirer-select-pro'
import { input } from '@inquirer/prompts'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { makeMatchReporter } from './factories'
import { makeLogParser } from './factories/log-parser'
import { type GetReportOption } from './presentation/match-reporter'

const fileNotFoundErrorMessage = 'File not found.'

const logParser = makeLogParser()
const reporter = makeMatchReporter()

yargs(hideBin(process.argv))
  .command('*', 'Use interactive CLI: try `node dist/src`',
    (yargs) => {
      return yargs
    }, async () => {
      const gamelogsDirectory = path.resolve(process.cwd(), 'gamelogs')
      const reportsDirectory = path.resolve(process.cwd(), 'reports')

      if (!existsSync(gamelogsDirectory)) {
        await mkdir(gamelogsDirectory)
      }

      if (!existsSync(reportsDirectory)) {
        await mkdir(reportsDirectory)
      }

      const logFiles = await readdir(gamelogsDirectory)

      const choices = logFiles.map((file) => ({
        value: path.resolve(gamelogsDirectory, file), name: file
      }))

      const fileChoice = await select({
        message: 'Choose a log file',
        choices: [
          ...choices,
          new Separator(),
          {
            name: 'Use another file',
            value: 'filepath'
          }
        ]
      })

      const filepath = fileChoice !== 'filepath' ? fileChoice : (await input({ message: 'Enter your filepath' })).trim()

      if (!filepath) return

      if (!existsSync(filepath)) {
        console.error(fileNotFoundErrorMessage)
        return
      }

      const outputProperties = await multipleSelect({
        message: 'Select output properties, or just hit ENTER to use default',
        options: [
          { name: 'Match info', value: 'match-info', disabled: true },
          { name: 'Scoreboard', value: 'scoreboard', disabled: true },
          { name: 'Means of death', value: 'mod' }
        ]
      })

      const printChoice = await select({
        message: 'Print output?',
        choices: [
          {
            name: 'Pretty print',
            value: 'pretty'
          },
          {
            name: 'No print',
            value: null
          },
          {
            name: 'JSON print',
            value: 'json'
          }
        ]
      })

      const exportChoice = await select({
        message: 'Export output?',
        choices: [
          {
            name: 'No export',
            value: null
          },
          {
            name: 'JSON file',
            value: 'json'
          }
        ]
      })

      const matches = await logParser.parse(filepath)
      const reports = reporter.getReport(matches, 'scoreboard', ...outputProperties as GetReportOption[])

      if (printChoice) {
        if (printChoice === 'pretty') console.log(reporter.getPrettyReports(reports))
        else console.dir(reports, { depth: 3 })
      }
      if (exportChoice === 'json') {
        await writeFile(
          path.resolve(reportsDirectory, `${new Date().getTime().toString()}.json`),
          JSON.stringify(reports),
          'utf-8'
        )
      }
    })
  .parse()
