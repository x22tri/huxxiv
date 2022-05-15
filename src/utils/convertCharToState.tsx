import { useEffect, Dispatch, SetStateAction } from 'react'
import { DataOptions } from '../types'
import { getPronunciation } from './getPronunciation'

// 1. a - ɒ > ɑ
// 2. o -  o > ɔ
// 3. á - a: > æ(ː)
// 4. o - ɔ > ɒ
// 5. a - ɑ > ä

const useUpdateCharBasedOnYear = (
  initialState: DataOptions[],
  setWordState: Dispatch<SetStateAction<DataOptions[]>>,
  year: number
) => {
  useEffect(() => {
    setWordState(
      initialState.map(element => {
        if (!('word' in element)) return element
        else {
          const [phonemic, concurrentPronunciations, activeRules] =
            getPronunciation(element, year)

          return {
            ...element,
            ...{ ...{ phonemic, concurrentPronunciations, activeRules } },
          }
        }
      })
    )
  }, [year, initialState, setWordState])
}

export { useUpdateCharBasedOnYear }
