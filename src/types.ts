import { CASE_NAMES } from './database/CASE_NAMES'

// INTERFACES

// A "changeable" type is one whose versions are prone to disappearing and appearing over time.
// The first number of the tuple marks the "start date" while the second number marks the "end date" of the process.
// For sound changes, "disappears" marks the timeframe in which the old pronunciation is disappearing.
interface Changeable {
  disappears?: [number, number]
  appears?: [number, number]
}

interface ConcurrentPronunciation extends Changeable {
  id: number
  main?: string
  new?: string
  old?: string
  note?: string
}

interface GrammaticalCaseForm extends Changeable {
  form: string
}

interface Inflection extends Changeable {
  classes?: PartOfSpeech | VowelHarmony | InflectionType
  partOfSpeech: PartOfSpeech
  vowelHarmony: VowelHarmony
  inflectionType?: InflectionType
}

interface InflectionChange extends Changeable {
  id: number
  targetForm: string
  change: string
}

interface Keyword extends Changeable {
  word: string
  main?: boolean
  phonemic?: string[]
  concurrentPronunciations?: PhoneticInfo[]
  activeSoundChanges?: SoundChange[]
}

interface PhoneticInfo {
  main: string
  variants: ConcurrentPronunciation[]
}

interface SoundChange extends Changeable {
  id: number
  target: string
  change?: string
  note?: string
}

interface Word {
  id: number
  data: DataOptions[]
}

interface WordUse extends Changeable {
  meaning: string
  examples?: string[]
}

// TYPES

type ActivePane = 'meaning' | 'pronunciation' | 'inflection'
type CaseName = keyof typeof CASE_NAMES
type CaseNameWithNumber = `${CaseName}_sg` | `${CaseName}_pl`
type DataOptions = Keyword | Inflection | WordUse | PhoneticInfo[]
type Declension = {
  [K in CaseNameWithNumber]: GrammaticalCaseForm[]
}
type ErrorMessage = string
type InflectionType = 'nyitótő' | 'hangkivető' | 'rövidülő'
type PartOfSpeech = 'főnév' | 'ige' | 'melléknév' | 'névutó' | 'határozószó'
type VowelHarmony = 'o' | 'e' | 'ö'

export type {
  ActivePane,
  CaseName,
  CaseNameWithNumber,
  Changeable,
  ConcurrentPronunciation,
  DataOptions,
  Declension,
  ErrorMessage,
  GrammaticalCaseForm,
  Inflection,
  InflectionChange,
  InflectionType,
  Keyword,
  PartOfSpeech,
  PhoneticInfo,
  SoundChange,
  VowelHarmony,
  Word,
  WordUse,
}
