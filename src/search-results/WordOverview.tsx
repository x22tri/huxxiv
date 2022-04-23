import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import { Keyword, WordUse, Word } from '../database/CHARSV2'

import convertCharToState from '../utils/convertCharToState'

const WordOverview = ({
  measuredRef,
  word,
}: {
  measuredRef: (node: HTMLDivElement | null) => void
  word: Word
}) => {
  // Setting up state.
  const [currentYear, setCurrentYear] = useState(2000)
  const [wordState] = useState(convertCharToState(word))

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
  const handleAppear = (dataObject: {
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
    'word' in wordObject && handleAppear(wordObject) ? wordObject : []
  )

  const useList: WordUse[] = wordState.flatMap(wordObject =>
    'meaning' in wordObject && handleAppear(wordObject) ? wordObject : []
  )

  // A dynamic style attribute that shows a yellow flash when an element appears.
  // Has to be placed next to the element, at the same level.
  const Flash = () => (
    <style type='text/css'>
      {`.flash {
            border-radius: 4px;
            animation: yellow-fade ${
              currentYear === 2000 ? 0 : 0.5
            }s ease-in-out 0s;
          }`}
    </style>
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
            <React.Fragment key={wordObject.word}>
              <Flash />
              <span
                className='flash'
                style={{
                  color: `rgba(0, 0, 0, ${calculateOpacity(wordObject)}`,
                }}
              >
                {index > 0 && ' / '}
                {wordObject.word}
              </span>
            </React.Fragment>
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
        <ListGroup as='ol' variant='flush' numbered>
          {useList.map(wordObject => (
            <React.Fragment key={wordObject.meaning}>
              <Flash />
              <ListGroup.Item
                as='li'
                className='fs-5 p-3 d-flex align-items-start flash'
                style={{
                  color: `rgba(0, 0, 0, ${calculateOpacity(wordObject)}`,
                }}
              >
                <div className='d-flex flex-column w-100 justify-content-between ms-2'>
                  <div className='d-flex justify-content-between'>
                    {wordObject.meaning}
                  </div>
                  <div>
                    {wordObject.examples &&
                      wordObject.examples.map((example, index) => (
                        <div
                          className='fs-6'
                          key={index}
                          style={{
                            color: `rgba(108, 117, 125, ${calculateOpacity(
                              wordObject
                            )}`,
                          }}
                        >
                          {example}
                        </div>
                      ))}
                  </div>
                </div>
              </ListGroup.Item>
            </React.Fragment>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default WordOverview
