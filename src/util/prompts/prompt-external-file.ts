import { input } from '@inquirer/prompts'

export const promptExternalFile = async (): Promise<string> => (await input({ message: 'Enter your filepath' })).trim()
