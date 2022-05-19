import { useState, useEffect } from 'react'

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

export default useChangeYearOnScroll
