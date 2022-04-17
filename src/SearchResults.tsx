import { useState, useEffect, useCallback } from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Stack from 'react-bootstrap/Stack'

import { Word } from './CHARS'
import { ErrorMessage } from './App'
import './SearchResults.css'

import merger from './merger'

const ErrorField = ({ error }: { error: ErrorMessage }) => {
  return <div className='error-field d-flex my-auto'>{error}</div>
}

const WordOverview = ({
  measuredRef,
  word,
}: {
  measuredRef: (node: HTMLDivElement | null) => void
  word: Word
}) => {
  const [currentYear, setCurrentYear] = useState(2000)

  interface WordState extends Word {
    date: number
  }

  const [wordState, setWordState] = useState<WordState>({
    date: word.date || 2000,
    ...word,
  })

  // On downscrolls where new development dates are passed, these developments are added.
  // On upscrolls where new development dates (-1) are passed, these developments are removed.
  const checkForDevelopmentsPassed = useCallback(
    (scrollDirection: 'up' | 'down') => {
      // To-Do: implement upscrolls.
      // All "previous states" (the state of the preceding "era") should probably be saved in state as an array
      // and should be restored (as length - 1th element of array) when the corresponding dates are passed.

      // let developmentsPassed: Partial<Word>[] = word.laterDevelopments.filter(
      //   (development) =>
      //     development.date ===
      //     (scrollDirection === 'down' ? currentYear : currentYear + 1)
      // )
      // if (!!developmentsPassed.length) {
      //   console.log(developmentsPassed)
      // }
      if (scrollDirection === 'down') {
        let newDevelopments: Partial<WordState>[] | undefined =
          word.laterDevelopments?.filter(
            development =>
              development.date &&
              development.date <= currentYear &&
              development.date > wordState.date
          )
        if (!!newDevelopments?.length) {
          newDevelopments.forEach(development => {
            setWordState(prevState => ({
              ...prevState,
              date: development.date!,
            }))

            const merged = merger(
              JSON.parse(JSON.stringify(wordState)),
              development
            ) as WordState

            setWordState(merged)
          })
        }
      } else {
        //To-Do: scrolldirection up code
      }
    },
    [currentYear, word.laterDevelopments, wordState]
  )

  const handleScroll = useCallback(() => {
    let lastScrollTop = 0
    setCurrentYear(2000 + Math.floor(window.scrollY / 10))

    let scrollTop = window.scrollY || document.documentElement.scrollTop
    scrollTop > lastScrollTop
      ? checkForDevelopmentsPassed('down')
      : checkForDevelopmentsPassed('up')
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
  }, [checkForDevelopmentsPassed])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <Card
      ref={measuredRef}
      className='word-overview-card'
      style={{
        position: 'fixed',
      }}
    >
      <Card.Body className='p-0'>
        <Card.Title as='h3' className='px-3 pt-3'>
          {wordState.word}
        </Card.Title>
        <Card.Subtitle className='px-3 pb-3 text-muted'>
          {wordState.partOfSpeech}
        </Card.Subtitle>
        <ListGroup as='ol' variant='flush' numbered>
          {wordState.use.map(element =>
            element.event === 'obsolete' ? null : (
              <ListGroup.Item
                as='li'
                variant={element.event === 'dated' ? 'secondary' : undefined}
                className='fs-5 p-3 d-flex align-items-start'
                key={element.useId}
              >
                <div className='d-flex flex-column w-100 justify-content-between ms-2'>
                  <div className='d-flex justify-content-between'>
                    {element.meaning}
                    {element.event === 'dated' && (
                      <span className='list-item-tiny-text fs-6'>régies</span>
                    )}
                  </div>
                  <div>
                    {element.examples &&
                      element.examples.map((example, index) => (
                        <div className='text-muted fs-6' key={index}>
                          {example}
                        </div>
                      ))}
                  </div>
                </div>
              </ListGroup.Item>
            )
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

const isErrorMessage = (
  searchResult: Word | ErrorMessage
): searchResult is ErrorMessage => {
  return typeof (searchResult as ErrorMessage) === 'string'
}

const SearchResults = ({
  searchResult,
}: {
  searchResult: Word | ErrorMessage
}) => {
  const [cardHeight, setCardHeight] = useState<number>(0)
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setCardHeight(node.getBoundingClientRect().height)
    }
  }, [])

  return isErrorMessage(searchResult) ? (
    <ErrorField error={searchResult} />
  ) : (
    <div className='word-overview-container'>
      <p className='scroll-down-prompter'>
        ↓ Görgess lefelé a szó fejlődésének megtekintéséhez ↓
      </p>
      {cardHeight && (
        <Stack
          style={{ marginTop: cardHeight / 2, float: 'left' }}
          className='px-5 w-100'
        >
          {[2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400].map(
            element => (
              <div key={element} className='year'>
                {element}
                <hr />
                {/* {currentYear} */}
              </div>
            )
          )}
        </Stack>
      )}
      <WordOverview word={searchResult} {...{ measuredRef }} />
    </div>
  )
}

export default SearchResults
