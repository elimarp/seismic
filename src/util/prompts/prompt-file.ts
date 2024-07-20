import select, { Separator } from '@inquirer/select'

export const promptFile = async (choices: { name: string, value: string }[]): Promise<string> =>
  await select({
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
