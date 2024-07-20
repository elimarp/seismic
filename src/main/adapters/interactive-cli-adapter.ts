import { existsSync } from 'fs'
import { mkdir, readdir, writeFile } from 'fs/promises'
import path from 'path'
import { GAMELOGS_DIRECTORY, REPORTS_DIRECTORY } from '../../util/constants'
import {
  promptExportOption,
  promptExternalFile,
  promptFile,
  promptOutputProperties,
  promptPrintOption
} from '../../util/prompts'
import { type GetReportOption } from '../../presentation/match-reporter'
import { makeLogParser, makeMatchReporter } from '../factories'

const fileNotFoundErrorMessage = 'File not found.'

const logParser = makeLogParser()
const reporter = makeMatchReporter()

export const adaptInteractiveCli = async () => {
  if (!existsSync(GAMELOGS_DIRECTORY)) { await mkdir(GAMELOGS_DIRECTORY) }
  if (!existsSync(REPORTS_DIRECTORY)) { await mkdir(REPORTS_DIRECTORY) }

  const logFiles = await readdir(GAMELOGS_DIRECTORY)
  const choices = logFiles.map((file) => ({
    value: path.resolve(GAMELOGS_DIRECTORY, file),
    name: file
  }))
  const fileChoice = await promptFile(choices)

  const filepath = fileChoice !== 'filepath' ? fileChoice : await promptExternalFile()
  if (!filepath) return

  if (!existsSync(filepath)) {
    console.error(fileNotFoundErrorMessage)
    return
  }

  const outputProperties = await promptOutputProperties()
  const printChoice = await promptPrintOption()
  const exportChoice = await promptExportOption()

  const matches = await logParser.parse(filepath)
  const reports = reporter.getReport(matches, 'scoreboard', ...outputProperties as GetReportOption[])

  if (printChoice) {
    if (printChoice === 'pretty') console.log(reporter.getPrettyReports(reports))
    else console.dir(reports, { depth: 3 })
  }
  if (exportChoice === 'json') {
    await writeFile(
      path.resolve(REPORTS_DIRECTORY, `${new Date().getTime().toString()}.json`),
      JSON.stringify(reports),
      'utf-8'
    )
  }
}
