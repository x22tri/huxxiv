import { useState } from 'react'
import {
  Keyword,
  PartOfSpeech,
  InflectionType,
  WordUse,
  Word,
  Changeable,
} from './CHARSV2'

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
  //   console.log(word)

  let wordChronology: {
    date: number
    // state: {
    //   word: Keyword[]
    //   partOfSpeech: string | undefined
    //   inflectionType?: InflectionType[]
    //   uses?: WordUse[]
    // }
    state: {}
  }[] = []

  // if (
  //   word.data.find(
  //     (element: Keyword | PartOfSpeech | InflectionType | WordUse) =>
  //       'word' in element && !('appearanceStartDate' in element)
  //   )
  // ) {
  //   wordChronology.push({
  //     date: 2000,
  //     state: {
  //       word: [],
  //       partOfSpeech: undefined,
  //       inflectionType: [],
  //       uses: [],
  //     },
  //   })
  // }

  // word.data.forEach(element => {
  //   // If the element doesn't have an "appearanceStartDate", it's already being used in 2000.
  //   if (!('appearance' in element)) {
  //     // let baseState = wordChronology[0].state
  //     // if ('word' in element) {
  //     //   baseState.word.push(element)
  //     // } else if ('partOfSpeech' in element) {
  //     //   baseState.partOfSpeech = element.partOfSpeech
  //     // } else if ('inflectionType' in element) {
  //     //   baseState.inflectionType.push(element)
  //     // } else if ('meaning' in element) {
  //     //   baseState.uses.push(element)
  //     // }
  //     // console.log(baseState)
  //   }
  // })

  return word.data
}

export default convertCharToState
