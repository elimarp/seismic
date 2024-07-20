import select from '@inquirer/select'

export const promptExportOption = async (): Promise<string | null> => await select({
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
