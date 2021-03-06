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

// interface Inflection extends Changeable {
//   classes?: (PartOfSpeech | VowelHarmony | InflectionType)[]
//   partOfSpeech: PartOfSpeech
//   vowelHarmony: VowelHarmony
// }

interface InflectionChange extends Changeable {
  id: number
  targetForm: string
  change: string
  classes?: (PartOfSpeech | VowelHarmony | InflectionType)[]
}

interface Keyword extends Changeable {
  word: string
  main?: boolean
  phonemic?: string[]
  activeSoundChanges?: PronunciationChange[][]
  mainPronunciation?: string
}

interface PhoneticInfo {
  main: string
  variants: ConcurrentPronunciation[]
}

interface PronunciationChange extends Changeable {
  sound: string
  note?: string
}

interface SoundChangeRule extends Changeable {
  id: number
  change:
    | `${SoundChangeTarget}/${SoundChangeChangeTo}`
    | `${SoundChangeTarget}/${SoundChangeChangeTo}/${SoundChangeEnvironment}`
    | `${SoundChangeTarget}/${SoundChangeChangeTo}/${SoundChangeEnvironment}/${SoundChangeException}`
    | `${SoundChangeTarget}/${SoundChangeChangeTo}/${SoundChangeEnvironment}/${SoundChangeException}/${SoundChangeElse}`
  note?: string
}

interface Word {
  id: number
  word: string
  phonemic?: string[]
  activeSoundChanges?: PronunciationChange[][]
  mainPronunciation?: string
  partOfSpeech: PartOfSpeech
  vowelHarmony: VowelHarmony
  classes?: InflectionType[]
  meanings: WordUse[]
}

interface WordUse extends Changeable {
  meaning: string
  examples?: string[]
}

// TYPES

type ActivePane = 'meaning' | 'pronunciation' | 'inflection'
type CaseName = keyof typeof CASE_NAMES
type CaseNameWithNumber = `${CaseName}_sg` | `${CaseName}_pl`
// type DataOptions = Keyword | Inflection | WordUse | PhoneticInfo[]
type Declension = {
  [K in CaseNameWithNumber]: GrammaticalCaseForm[]
}
type ErrorMessage = string
type InflectionType = 'nyit??t??' | 'hangkivet??' | 'r??vid??l??'
type PartOfSpeech = 'f??n??v' | 'ige' | 'mell??kn??v' | 'n??vut??' | 'hat??roz??sz??'
type SoundChangeTarget = string
type SoundChangeChangeTo = string
type SoundChangeEnvironment = string
type SoundChangeException = string
type SoundChangeElse = string
type VowelHarmony = 'o' | 'e' | '??'

export type {
  ActivePane,
  CaseName,
  CaseNameWithNumber,
  Changeable,
  ConcurrentPronunciation,
  // DataOptions,
  Declension,
  ErrorMessage,
  GrammaticalCaseForm,
  // Inflection,
  InflectionChange,
  InflectionType,
  Keyword,
  PartOfSpeech,
  PhoneticInfo,
  PronunciationChange,
  SoundChangeRule,
  VowelHarmony,
  Word,
  WordUse,
}
