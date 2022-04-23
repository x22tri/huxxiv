// A "changeable" type is one whose versions are prone to disappearing and appearing over time.
// The first number of the tuple marks the "start date" while the second number marks the "end date" of the process.
interface Changeable {
  disappears?: [number, number]
  appears?: [number, number]
}

interface Keyword extends Changeable {
  word: string
}

interface PartOfSpeech {
  partOfSpeech: 'főnév' | 'ige' | 'melléknév' | 'névutó' | 'határozószó'
}

interface InflectionType extends Changeable {
  inflectionType: string
}

interface WordUse extends Changeable {
  meaning: string
  examples?: string[]
}

interface Word {
  id: number
  data: (Keyword | PartOfSpeech | InflectionType | WordUse)[]
}

const CHARS: Word[] = [
  {
    id: 1,
    data: [
      { word: 'kapcsos', disappears: [2030, 2080] },
      { word: 'kapcsʚs', appears: [2020, 2040] },
      { partOfSpeech: 'melléknév' },
      { inflectionType: '-osADJ' },
      {
        meaning: 'Olyan <tárgy, eszköz>, amelyen kapocs van.',
        examples: ['kapcsos ruha', 'kapcsos pénztárca'],
        disappears: [2030, 2080],
      },
      {
        meaning: 'Kapocs alakú.',
        examples: ['kapcsos zárójel'],
      },
      {
        meaning: '<Vmivel> kapcsolatos, összefüggésben lévő.',
        examples: ['az örökléssel kapcsos ügyek'],
        appears: [2060, 2100],
      },
    ],
  },
]

export type { Keyword, PartOfSpeech, InflectionType, WordUse, Word, Changeable }
export { CHARS }
