import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { DataOptions, ErrorMessage, Word } from '../types'
import getPronunciation from './getPronunciation'

const graphPhonemeDictionary = [
  { letter: 'a', phoneme: 'ɒ', soundType: 'vowel' },
  { letter: 'á', phoneme: 'aː', soundType: 'vowel' },
  { letter: 'b', phoneme: 'b', soundType: 'consonant' },
  { letter: 'c', phoneme: 't͡s', soundType: 'consonant' },
  { letter: 'cs', phoneme: 't͡ʃ', soundType: 'consonant' },
  { letter: 'd', phoneme: 'd', soundType: 'consonant' },
  { letter: 'dz', phoneme: 'd͡z', soundType: 'consonant' },
  { letter: 'dzs', phoneme: 'd͡ʒ', soundType: 'consonant' },
  { letter: 'e', phoneme: 'ɛ', soundType: 'vowel' },
  { letter: 'é', phoneme: 'eː', soundType: 'vowel' },
  { letter: 'f', phoneme: 'f', soundType: 'consonant' },
  { letter: 'g', phoneme: 'g', soundType: 'consonant' },
  { letter: 'gy', phoneme: 'ɟ', soundType: 'consonant' },
  { letter: 'h', phoneme: 'h', soundType: 'consonant' },
  { letter: 'i', phoneme: 'i', soundType: 'vowel' },
  { letter: 'í', phoneme: 'iː', soundType: 'vowel' },
  { letter: 'j', phoneme: 'j', soundType: 'consonant' },
  { letter: 'k', phoneme: 'k', soundType: 'consonant' },
  { letter: 'l', phoneme: 'l', soundType: 'consonant' },
  { letter: 'ly', phoneme: 'j', soundType: 'consonant' },
  { letter: 'm', phoneme: 'm', soundType: 'consonant' },
  { letter: 'n', phoneme: 'n', soundType: 'consonant' },
  { letter: 'ny', phoneme: 'ɲ', soundType: 'consonant' },
  { letter: 'o', phoneme: 'o', soundType: 'vowel' },
  { letter: 'ó', phoneme: 'oː', soundType: 'vowel' },
  { letter: 'ö', phoneme: 'ø', soundType: 'vowel' },
  { letter: 'ő', phoneme: 'øː', soundType: 'vowel' },
  { letter: 'p', phoneme: 'p', soundType: 'consonant' },
  { letter: 'q', phoneme: 'kv', soundType: 'consonant' },
  { letter: 'r', phoneme: 'r', soundType: 'consonant' },
  { letter: 's', phoneme: 'ʃ', soundType: 'consonant' },
  { letter: 'sz', phoneme: 's', soundType: 'consonant' },
  { letter: 't', phoneme: 't', soundType: 'consonant' },
  { letter: 'ty', phoneme: 'c', soundType: 'consonant' },
  { letter: 'u', phoneme: 'u', soundType: 'vowel' },
  { letter: 'ú', phoneme: 'uː', soundType: 'vowel' },
  { letter: 'ü', phoneme: 'y', soundType: 'vowel' },
  { letter: 'ű', phoneme: 'yː', soundType: 'vowel' },
  { letter: 'v', phoneme: 'v', soundType: 'consonant' },
  { letter: 'z', phoneme: 'z', soundType: 'consonant' },
  { letter: 'zs', phoneme: 'ʒ', soundType: 'consonant' },
]

const convertKeywordToPhonemes = (keyword: string): string[] => {
  // Sort letters by length and make a Regex out of it.
  const keywordBreakdownToLetters = keyword.match(
    new RegExp(
      graphPhonemeDictionary
        .map(i => i.letter)
        .sort()
        .reverse()
        .join('|'),
      'gi'
    )
  )

  let phonemicResult: string[] = []
  keywordBreakdownToLetters?.forEach(letter => {
    const phonemeObject = graphPhonemeDictionary.find(i => i.letter === letter)
    if (phonemeObject) phonemicResult.push(phonemeObject.phoneme)
  })

  // return { phonemic: phonemicResult }
  return phonemicResult
}

// 1. a - ɒ > ɑ
// 2. o -  o > ɔ
// 3. á - a: > æ(ː)
// 4. o - ɔ > ɒ
// 5. a - ɑ > ä

const convertCharToState = (word: DataOptions[], currentYear: number) => {
  let dataWithPhonemic = word.map(element => {
    if (!('word' in element)) return element
    else {
      let phonemic = element.phonemic || convertKeywordToPhonemes(element.word)
      return {
        ...element,
        phonemic: phonemic,
        ...getPronunciation(phonemic, currentYear),
      }
    }
  })

  return dataWithPhonemic
}

// const isErrorMessage = (
//   searchResult: Word | ErrorMessage
// ): searchResult is ErrorMessage => {
//   return typeof (searchResult as ErrorMessage) === 'string'
// }

// const useInitialFetch = (
//   // searchResult: ErrorMessage | Word,
//   wordState: DataOptions[],
//   setWordState: Dispatch<SetStateAction<DataOptions[]>>
//   // errorState: undefined | ErrorMessage,
//   // setErrorState: Dispatch<SetStateAction<undefined | ErrorMessage>>
// ) => {
//   useEffect(() => {
//     // if (isErrorMessage(searchResult)) {
//     //   setWordState([])
//     //   setErrorState(searchResult)
//     // } else {
//     // setErrorState(undefined)
//     setWordState(convertCharToState(wordState, 2000))
//     // }
//   }, [setWordState])
// }

const useUpdateCharBasedOnYear = (
  initialState: DataOptions[],
  setWordState: Dispatch<SetStateAction<DataOptions[]>>,
  currentYear: number
) => {
  useEffect(() => {
    setWordState(convertCharToState(initialState, currentYear))
  }, [currentYear, initialState, setWordState])
}

// Create "useInitialFetch" hook.
// This hook will be a useEffect call that has access to wordState, setWordState and getPronunciation.
// It will add the "phonemic" and "pronunciation" keys and data to all {word: ...}s on WordOverview mount.
// After that, a "useScroll" hook will update the state on scroll (and change everything except the underlying phonemic representation).

export { convertCharToState, useUpdateCharBasedOnYear }
