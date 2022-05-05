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

interface Phonemic {
  phonemic: string[]
}

interface Pronunciation extends Changeable {
  pronunciation: string
}

type DataOptions =
  | Keyword
  | PartOfSpeech
  | InflectionType
  | WordUse
  | Phonemic
  | Pronunciation

interface Word {
  id: number
  data: DataOptions[]
}

// This is for sound change rules.
interface Rule extends Changeable {
  target: string
  change?: string
}

export type {
  Keyword,
  PartOfSpeech,
  InflectionType,
  WordUse,
  Word,
  Changeable,
  DataOptions,
  Phonemic,
  Pronunciation,
  Rule,
}
