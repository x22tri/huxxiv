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
  wordState: Word,
  setWordState: Dispatch<SetStateAction<Word>>
): number => {
  let year = useChangeYearOnScroll()
  const [activeSoundChanges, mainPronunciation] = getPronunciation(
    initialState,
    year
  )

  useEffect(() => {
    setWordState({ ...wordState, activeSoundChanges, mainPronunciation })
  }, [
    year,
    initialState,
    setWordState,
    activeSoundChanges,
    mainPronunciation,
    wordState,
  ])

  return year
}

export { useUpdateCharBasedOnYear }
