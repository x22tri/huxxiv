import { useState, useEffect, useCallback } from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Stack from 'react-bootstrap/Stack'

import { Word, Keyword } from './CHARSV2'
import { ErrorMessage } from './App'
import './SearchResults.css'

// import merger from './merger'

import convertCharToState from './convertCharToState'

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
  // Setting up state.
  const [currentYear, setCurrentYear] = useState(2000)
  const [wordState, setWordState] = useState(convertCharToState(word))

  // Setting up the scroll / year connection.
  useEffect(() => {
    const handleScroll = () =>
      setCurrentYear(2000 + Math.floor(window.scrollY / 10))

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // The function that makes obsolete elements disappear and new elements appear.
  const handleAppearDisappear = (dataObject: {
    appears?: [number, number]
    disappears?: [number, number]
  }) =>
    !('disappears' in dataObject) && !('appears' in dataObject)
      ? dataObject // If the object has neither property, it should always be shown.
      : dataObject.appears && dataObject.appears[0] > currentYear
      ? null // If the object has an "appears" property, but we haven't reached it yet, show nothing.
      : dataObject.disappears && dataObject.disappears[1] < currentYear
      ? null // If the object has a "disappears" property and we've gone past it, show nothing.
      : dataObject

  // The function that calculates an element's opacity based on when it appears / disappears from the language.
  const calculateOpacity = (dataObject: {
    appears?: [number, number]
    disappears?: [number, number]
  }): number | undefined => {
    if (!dataObject.appears && !dataObject.disappears) return 1
    else {
      const calculatorFunc = (start: number, end: number): number | undefined =>
        (currentYear - start) / (end - start)

      let calcResult, opacity

      if (dataObject.appears) {
        calcResult = calculatorFunc(
          dataObject.appears[0],
          dataObject.appears[1]
        )
        opacity = calcResult !== undefined && calcResult < 1 ? calcResult : 1
      }

      if (dataObject.disappears) {
        calcResult = calculatorFunc(
          dataObject.disappears[0],
          dataObject.disappears[1]
        )
        opacity =
          calcResult !== undefined && calcResult >= 0 ? 1 - calcResult : 1
      }

      return opacity
    }
  }

  // TypeScript doesn't seem to allow a "Keyword[]" return value with the regular "filter" function.
  const keywordList: Keyword[] = wordState.flatMap(wordObject =>
    'word' in wordObject && handleAppearDisappear(wordObject) ? wordObject : []
  )

  // The main return on the WordOverview component.
  return (
    <Card
      ref={measuredRef}
      className='word-overview-card'
      style={{ position: 'fixed' }}
    >
      <Card.Body className='p-0'>
        <Card.Title as='h3' className='px-3 pt-3'>
          {keywordList.map((wordObject, index) => (
            <span
              key={wordObject.word}
              className='flash keyword'
              style={{
                color: `rgba(0, 0, 0, ${calculateOpacity(wordObject)}`,
              }}
            >
              {index > 0 && ' / '}
              {wordObject.word}
            </span>
          ))}
        </Card.Title>
        <Card.Subtitle className='px-3 pb-3 text-muted'>
          {wordState.map(wordObject =>
            'partOfSpeech' in wordObject ? (
              <span key={wordObject.partOfSpeech}>
                {wordObject.partOfSpeech}
              </span>
            ) : null
          )}
        </Card.Subtitle>
        {/* <ListGroup as='ol' variant='flush' numbered>
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
        </ListGroup> */}
        <div>{JSON.stringify(wordState)}</div>
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
    if (node !== null) setCardHeight(node.getBoundingClientRect().height)
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
