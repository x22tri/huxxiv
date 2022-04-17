interface WordUse {
  event?: 'dated' | 'obsolete' // A dated word shows a 'dated' indicator. An obsolete one is removed from the card altogether.
  examples?: string[]
  meaning?: string
  useId: number
}

interface LaterDevelopments extends Partial<Word> {
  laterDevelopments?: never // Recursion is not allowed.
}

interface Word {
  date?: number
  id?: number
  inflectionType?: string
  laterDevelopments?: LaterDevelopments[]
  partOfSpeech: 'főnév' | 'ige' | 'melléknév' | 'névutó' | 'határozószó'
  use: WordUse[]
  word: string
}

const CHARS: Word[] = [
  {
    id: 1,
    word: 'kapcsos',
    partOfSpeech: 'melléknév',
    inflectionType: '-osADJ',
    use: [
      {
        useId: 1,
        meaning: 'Olyan <tárgy, eszköz>, amelyen kapocs van.',
        examples: ['kapcsos ruha', 'kapcsos pénztárca'],
      },
      {
        useId: 2,
        meaning: 'Kapocs alakú.',
        examples: ['kapcsos zárójel'],
      },
    ],
    laterDevelopments: [
      {
        date: 2053,
        use: [
          {
            useId: 3,
            meaning: '<Vmivel> kapcsolatos, összefüggésben lévő.',
            examples: ['az örökléssel kapcsos ügyek'],
          },
        ],
      },
      {
        date: 2083,
        use: [
          {
            useId: 1,
            // meaning: '<Vmivel> kapcsolatos, összefüggésben lévő.',
            // examples: ['az örökléssel kapcsos ügyek'],
            event: 'obsolete',
          },
        ],
      },
    ],
  },
]

export type { LaterDevelopments, Word, WordUse }
export { CHARS }
