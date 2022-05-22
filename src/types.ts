// A "changeable" type is one whose versions are prone to disappearing and appearing over time.
// The first number of the tuple marks the "start date" while the second number marks the "end date" of the process.
interface Changeable {
  disappears?: [number, number]
  appears?: [number, number]
}

// This is for sound change rules.
interface Rule extends Changeable {
  id: number
  target: string
  change?: string
  note?: string
}

interface Keyword extends Changeable {
  word: string
  main?: boolean
  phonemic?: string[]
  concurrentPronunciations?: PhoneticInfo[]
  activeRules?: Rule[]
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

interface ConcurrentPronunciation extends Changeable {
  id: number
  main?: string
  new?: string
  old?: string
  note?: string
}

interface PhoneticInfo {
  main: string
  variants: ConcurrentPronunciation[]
}

type DataOptions =
  | Keyword
  | PartOfSpeech
  | InflectionType
  | WordUse
  | PhoneticInfo[]

interface Word {
  id: number
  data: DataOptions[]
}

type ErrorMessage = string

type ActivePane = 'meaning' | 'pronunciation' | 'inflection'

export type {
  ActivePane,
  Changeable,
  ConcurrentPronunciation,
  DataOptions,
  ErrorMessage,
  InflectionType,
  Keyword,
  PartOfSpeech,
  PhoneticInfo,
  Rule,
  Word,
  WordUse,
}

// export const isKeyOfObject = <T>(
//   key: string | number | symbol,
//   obj: T
// ): key is keyof T => key in obj
