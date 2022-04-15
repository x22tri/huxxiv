interface WordUse {
  dateAttested?: number
  event?: 'dated' | 'obsolete'
  example?: string
  meaning?: string
  useId: number
}

interface Word {
  dateAttested?: number
  id: number
  inflectionType?: string
  laterDevelopments: object[]
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'postposition' | 'adverb'
  use: WordUse[]
  word: string
}

const CHARS: Word[] = [
  {
    id: 1,
    word: 'kapcsos',
    partOfSpeech: 'adjective',
    inflectionType: '-osADJ',
    use: [
      {
        useId: 1,
        meaning: 'Olyan <tárgy, eszköz>, amelyen kapocs van.',
        example: 'kapcsos ruha',
      },
      {
        useId: 2,
        meaning: 'Kapocs alakú.',
        example: 'kapcsos zárójel',
      },
    ],
    laterDevelopments: [
      {
        use: [
          {
            useId: 3,
            meaning: '<Vmivel> kapcsolatos.',
            example: 'az örökléssel kapcsos ügyek',
            dateAttested: 2053,
          },
        ],
      },
    ],
  },
]

export type { Word }
export { CHARS }
