import { Rule } from '../types'

const RULES: Rule[] = [
  {
    target: 'ɒ',
    change: 'ɑ',
    appears: [2010, 2050],
    disappears: [2040, 2080],
  },
  // { target: 'ɑ', change: 'ä', appears: [2060, 2090]}
]

export { RULES }
