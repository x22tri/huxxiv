import { CASE_NAMES } from './database/CASE_NAMES'

// A "changeable" type is one whose versions are prone to disappearing and appearing over time.
// The first number of the tuple marks the "start date" while the second number marks the "end date" of the process.
// For sound changes, "disappears" marks the timeframe in which the old pronunciation is disappearing.
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

type CaseName = keyof typeof CASE_NAMES
type CaseNameWithNumber = `${CaseName}_sg` | `${CaseName}_pl`
interface GrammaticalCase {
  main: string
  variants?: string[]
}

type Declension = {
  [K in CaseNameWithNumber]: GrammaticalCase
}

type PartOfSpeech = 'főnév' | 'ige' | 'melléknév' | 'névutó' | 'határozószó'
type VowelHarmony = 'o' | 'e' | 'ö'
type InflectionType = 'nyitótő' | 'hangkivető'

interface Inflection extends Changeable {
  partOfSpeech: PartOfSpeech
  vowelHarmony: VowelHarmony
  inflectionType?: InflectionType
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

// interface VowelHarmony {

// }

type DataOptions =
  | Keyword
  // | PartOfSpeech
  | Inflection
  | WordUse
  | PhoneticInfo[]
// | VowelHarmony

interface Word {
  id: number
  data: DataOptions[]
}

type ErrorMessage = string

type ActivePane = 'meaning' | 'pronunciation' | 'inflection'

export type {
  ActivePane,
  CaseName,
  CaseNameWithNumber,
  Changeable,
  ConcurrentPronunciation,
  DataOptions,
  Declension,
  ErrorMessage,
  GrammaticalCase,
  Inflection,
  InflectionType,
  Keyword,
  PartOfSpeech,
  PhoneticInfo,
  Rule,
  VowelHarmony,
  Word,
  WordUse,
}
