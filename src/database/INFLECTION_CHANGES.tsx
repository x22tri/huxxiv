import { InflectionChange } from '../types'

const INFLECTION_CHANGES: InflectionChange[] = [
  {
    id: 1,
    targetForm: 'dat_sg',
    change: `%STEM% számára`,
    appears: [2001, 2050],
  },
  {
    id: 2,
    targetForm: 'dat_pl',
    change: `%PLURAL_STEM%k számára`,
    appears: [2001, 2050],
  },
  {
    id: 3,
    targetForm: 'spe_sg',
    change: `%LOW_VOWEL_SUPERESSIVE_STEM%n`,
    appears: [2070, 2140],
    classes: ['rövidülő'],
  },
  {
    id: 4,
    targetForm: 'acc_sg',
    change: `%STEM%t`,
    appears: [2050, 2120],
    classes: ['rövidülő'],
  },
]

export default INFLECTION_CHANGES
