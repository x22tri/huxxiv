import { Changeable } from '../types'

let STEM

interface InflectionChange extends Changeable {
  id: number
  targetForm: string
  change: string
}

const INFLECTION_CHANGES: InflectionChange[] = [
  {
    id: 1,
    // affects: '-osADJ',
    targetForm: 'acc_sg',
    change: `${STEM}test`,
    appears: [2001, 2050],
    disappears: [2040, 2080],
    //   note: `test`,
  },
]

export default INFLECTION_CHANGES
