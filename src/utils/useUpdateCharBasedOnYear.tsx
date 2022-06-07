import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { DataOptions } from '../types'
import { getPronunciation } from './getPronunciation'

const useChangeYearOnScroll = () => {
  const startYear = 2000
  const [year, setYear] = useState(startYear + Math.floor(window.scrollY / 10))

  // To-Do: add debounce
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
      initialState.map(element =>
        'word' in element
          ? {
              ...element,
              concurrentPronunciations: getPronunciation(element, year),
            }
          : element
      )
    )
  }, [year, initialState, setWordState])

  return year
}

export { useUpdateCharBasedOnYear }
