import { useEffect, Dispatch, SetStateAction } from 'react'
import { DataOptions } from '../types'
import getPronunciation from './getPronunciation'

// 1. a - ɒ > ɑ
// 2. o -  o > ɔ
// 3. á - a: > æ(ː)
// 4. o - ɔ > ɒ
// 5. a - ɑ > ä

const convertCharToState = (word: DataOptions[], year: number) => {
  let dataWithPhonemic = word.map(element => {
    if (!('word' in element)) return element
    else {
      let [phonemic, concurrentPronunciations] = getPronunciation(element, year)
      return {
        ...element,
        ...{ ...{ phonemic, concurrentPronunciations } },
      }
    }
  })

  return dataWithPhonemic
}

const useUpdateCharBasedOnYear = (
  initialState: DataOptions[],
  setWordState: Dispatch<SetStateAction<DataOptions[]>>,
  year: number
) => {
  useEffect(() => {
    setWordState(convertCharToState(initialState, year))
  }, [year, initialState, setWordState])
}

export { convertCharToState, useUpdateCharBasedOnYear }
