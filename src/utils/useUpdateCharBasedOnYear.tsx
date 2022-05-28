import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { DataOptions } from '../types'
import { getPronunciation } from './getPronunciation'

// 1. a - ɒ > ɑ
// 2. o -  o > ɔ
// 3. á - a: > æ(ː)
// 4. o - ɔ > ɒ
// 5. a - ɑ > ä

const useChangeYearOnScroll = () => {
  const startYear = 2000
  const [year, setYear] = useState(startYear + Math.floor(window.scrollY / 10))

  useEffect(() => {
    const handleScroll = () => {
      setYear(startYear + Math.floor(window.scrollY / 10))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [year, setYear, startYear])

  return year
}

const useUpdateCharBasedOnYear = (
  initialState: DataOptions[],
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
): number => {
  let year = useChangeYearOnScroll()

  useEffect(() => {
    setWordState(
      initialState.map(element => {
        if (!('word' in element)) return element
        else {
          // Add pronunciation based on word.
          const [phonemic, concurrentPronunciations, activeSoundChanges] =
            getPronunciation(element, year)

          return {
            ...element,
            ...{
              ...{ phonemic, concurrentPronunciations, activeSoundChanges },
            },
          }
        }
      })
    )
  }, [year, initialState, setWordState])

  return year
}

export { useUpdateCharBasedOnYear }
