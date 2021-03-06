import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Word } from '../types'
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
  initialState: Word,
  setWordState: Dispatch<SetStateAction<Word>>
): number => {
  let year = useChangeYearOnScroll()

  useEffect(() => {
    const [activeSoundChanges, mainPronunciation] = getPronunciation(
      initialState,
      year
    )

    setWordState({ ...initialState, activeSoundChanges, mainPronunciation })
  }, [initialState, setWordState, year])

  return year
}

export { useUpdateCharBasedOnYear }
