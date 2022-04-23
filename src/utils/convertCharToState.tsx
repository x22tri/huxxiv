import { Word } from '../database/CHARSV2'

// interface WordChronologyInstance {
//   date: number
//   state: {
//     word: Keyword[]
//     partOfSpeech: PartOfSpeech | undefined
//     inflectionType: InflectionType[]
//     uses: WordUse[]
//   }
// }

// type DataOptions = Keyword | PartOfSpeech | InflectionType | WordUse

const convertCharToState = (word: Word) => {
  // let wordChronology: {
  //   date: number
  // state: {
  //   word: Keyword[]
  //   partOfSpeech: string | undefined
  //   inflectionType?: InflectionType[]
  //   uses?: WordUse[]
  // }
  //   state: {}
  // }[] = []

  return word.data
}

export default convertCharToState
