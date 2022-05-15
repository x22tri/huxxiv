// A "changeable" type is one whose versions are prone to disappearing and appearing over time.
// The first number of the tuple marks the "start date" while the second number marks the "end date" of the process.
interface Changeable {
  disappears?: [number, number]
  appears?: [number, number]
}

interface Pronunciation {
  mainPronunciation?: string
  numberOfVariants?: number
  activeRules?: []
}

interface Keyword extends Changeable, Pronunciation {
  word: string
  phonemic?: string[]
  concurrentPronunciations?: (string | PhoneticVariant)[]
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

// interface Phonemic {
//   phonemic: string[]
// }

// This is for sound change rules.
interface Rule extends Changeable {
  target: string
  change?: string
}

interface PhoneticVariant extends Changeable {
  main: string
  new?: string
  old?: string
}

type DataOptions = Keyword | PartOfSpeech | InflectionType | WordUse
// | Phonemic
// | Pronunciation

interface Word {
  id: number
  data: DataOptions[]
}

type ErrorMessage = string

export type {
  Changeable,
  DataOptions,
  ErrorMessage,
  InflectionType,
  Keyword,
  PartOfSpeech,
  // Phonemic,
  PhoneticVariant,
  // Pronunciation,
  Rule,
  Word,
  WordUse,
}
