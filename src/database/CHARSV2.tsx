import { Word } from '../types'

const CHARS: Word[] = [
  {
    id: 1,
    data: [
      { word: 'kapcsos' },
      { partOfSpeech: 'melléknév' },
      { inflectionType: '-osADJ' },
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
        appears: [2050, 2100],
      },
    ],
  },
]

export { CHARS }
