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
  {
    id: 2,
    target: 'o',
    change: 'ɔ',
    appears: [2030, 2050],
    disappears: [2045, 2065],
    note: 'Az <o> betűvel jelölt hang képzése lazábbá válik.',
  },
  {
    id: 3,
    target: 'ɔ',
    change: 'ɒ',
    appears: [2055, 2085],
    disappears: [2075, 2090],
    note: 'Az <o> betűvel jelölt hang képzése még lazábbá válik, a 2000-es évek <a> betűvel jelölt hangjáig.',
  },
  {
    id: 4,
    target: 'ɑ',
    change: 'ä',
    appears: [2050, 2090],
    disappears: [2080, 2130],
    note: 'Az <a> betűvel jelölt hang képzése előrébb kerül, hogy elkülönüljön az <o> betűvel jelölt hangtól, amely az [ɒ] felé tolódik.',
  },
]

export { RULES }
