import { useState, useEffect, Dispatch, SetStateAction } from 'react'

const useChangeYearOnScroll = () => {
  const startingYear = 2000
  const [year, setYear] = useState(
    startingYear + Math.floor(window.scrollY / 10)
  )

  console.log(year)

  useEffect(() => {
    const handleScroll = () => {
      setYear(startingYear + Math.floor(window.scrollY / 10))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [year, setYear, startingYear])

  return year
}

export default useChangeYearOnScroll
