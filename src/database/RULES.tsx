import { Rule } from '../types'

const RULES: Rule[] = [
  {
    id: 1,
    target: 'ɒ',
    change: 'ɑ',
    appears: [2001, 2050],
    disappears: [2040, 2080],
    note: 'Az <a> betűvel jelölt hang a XXI. század elejétől kezdve fokozatosan elveszti ajakkerekítéses jellegét.',
  },
  // { target: 'ɑ', change: 'ä', appears: [2060, 2090]}
]

export { RULES }
