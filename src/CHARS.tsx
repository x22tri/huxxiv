interface WordUse {
  event?: 'dated' | 'obsolete'
  examples?: string[]
  meaning?: string
  useId: number
}

interface LaterDevelopments extends Partial<Word> {
  laterDevelopments?: never
}

interface Word {
  date?: number
  id: number
  inflectionType?: string
  laterDevelopments: LaterDevelopments[]
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
    ],
  },
]

export type { LaterDevelopments, Word }
export { CHARS }
