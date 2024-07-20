import select from '@inquirer/select'

export const promptPrintOption = async (): Promise<string | null> => await select({
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
