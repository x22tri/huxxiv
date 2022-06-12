import { Word } from '../types'

const WORDS: Word[] = [
  {
    id: 1,
    word: 'kapcsos',
    partOfSpeech: 'melléknév',
    vowelHarmony: 'o',
    meanings: [
      {
        meaning: 'Olyan <tárgy, eszköz>, amelyen kapocs van.',
        examples: ['kapcsos ruha', 'kapcsos pénztárca'],
        disappears: [2120, 2230],
      },
      {
        meaning: 'Kapocs alakú.',
        examples: ['kapcsos zárójel'],
      },
      {
        meaning: '<Vmivel> kapcsolatos, összefüggésben lévő.',
        examples: ['az örökléssel kapcsos ügyek'],
        appears: [2045, 2100],
      },
    ],
  },
  {
    id: 2,
    word: 'szamár',
    partOfSpeech: 'főnév',
    vowelHarmony: 'o',
    classes: ['rövidülő', 'nyitótő'],
    meanings: [],
  },
]

export { WORDS }
