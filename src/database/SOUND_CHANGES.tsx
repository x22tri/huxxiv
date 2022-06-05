import { SoundChange } from '../types'

const SOUND_CHANGES: SoundChange[] = [
  {
    id: 1,
    target: 'ɒ',
    change: 'ɑ',
    appears: [2001, 2050],
    disappears: [2040, 2080],
    note: `Az *a* betűvel jelölt hang fokozatosan elveszti ajakkerekítéses jellegét.`,
  },
  {
    id: 2,
    target: 'o',
    change: 'ɔ',
    appears: [2030, 2050],
    disappears: [2045, 2085],
    note: 'Az *o* betűvel jelölt hang képzése lazábbá válik.',
  },
  {
    id: 3,
    target: 'aː',
    change: 'æː',
    appears: [2010, 2050],
    disappears: [2035, 2080],
    note: 'Az *á* betűvel jelölt hang képzése előrébb kerül.',
  },
  {
    id: 4,
    target: 'ɔ',
    change: 'ɒ',
    appears: [2050, 2090],
    disappears: [2075, 2110],
    note: 'Az *o* betűvel jelölt hang képzése még lazábbá válik, a 2000-es évek *a* betűvel jelölt hangjáig.',
  },
  {
    id: 5,
    target: 'ɑ',
    change: 'ä',
    appears: [2060, 2085],
    disappears: [2080, 2130],
    note: 'Az *a* betűvel jelölt hang képzése előrébb kerül, hogy elkülönüljön az *o* betűvel jelölt hangtól, amely az [ɒ] felé tolódik.',
  },
]

export { SOUND_CHANGES }
