import { select as multipleSelect } from 'inquirer-select-pro'

export const promptOutputProperties = async (): Promise<string[]> => await multipleSelect({
  message: 'Select output properties, or just hit ENTER to use default',
  options: [
    { name: 'Match info', value: 'match-info', disabled: true },
    { name: 'Scoreboard', value: 'scoreboard', disabled: true },
    { name: 'Means of death', value: 'mod' },
    { name: 'Player titles', value: 'player-title' }
  ]
})
