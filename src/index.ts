import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { adaptInteractiveCli } from './main/adapters'

yargs(hideBin(process.argv))
  .command('*', 'Use interactive CLI: try `node dist/src`',
    (yargs) => {
      return yargs
    }, async () => { await adaptInteractiveCli() })
  .parse()
