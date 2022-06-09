import { SoundChangeRule } from '../types'

const CATEGORIES = {
  V: ['a', 'o', 'ɔ', 'ɒ', 'ɑ', 'ä'], // vowels
  P: ['p', 'b'],
}

const SOUND_CHANGES: SoundChangeRule[] = [
  {
    id: 1,
    change: 'ɒ/ɑ',
    appears: [2001, 2050],
    disappears: [2040, 2080],
    note: `Az *a* betűvel jelölt hang fokozatosan elveszti ajakkerekítéses jellegét.`,
  },
  {
    id: 2,
    change: 'o/ɔ',
    appears: [2030, 2050],
    disappears: [2045, 2085],
    note: 'Az *o* betűvel jelölt hang képzése lazábbá válik.',
  },
  {
    id: 3,
    change: 'aː/æː',
    appears: [2010, 2050],
    disappears: [2035, 2080],
    note: 'Az *á* betűvel jelölt hang képzése előrébb kerül.',
  },
  {
    id: 4,
    change: 'ɔ/ɒ',
    appears: [2050, 2090],
    disappears: [2075, 2110],
    note: 'Az *o* betűvel jelölt hang képzése még lazábbá válik, a 2000-es évek *a* betűvel jelölt hangjáig.',
  },
  {
    id: 5,
    change: 'ɑ/ä',
    appears: [2060, 2085],
    disappears: [2080, 2130],
    note: 'Az *a* betűvel jelölt hang képzése előrébb kerül, hogy elkülönüljön az *o* betűvel jelölt hangtól, amely az [ɒ] felé tolódik.',
  },
  {
    id: 6,
    change: 'Pt͡ʃ/t͡ʃː',
    appears: [2060, 2085],
    disappears: [2080, 2130],
  },
  // {
  //   id: 7,
  //   change: 'k/g/#_',
  //   appears: [2060, 2085],
  //   disappears: [2080, 2130],
  // },
  // {
  //   id: 8,
  //   change: 'V/e',
  //   appears: [2060, 2085],
  //   disappears: [2080, 2130],
  // },
]

export { SOUND_CHANGES, CATEGORIES }
