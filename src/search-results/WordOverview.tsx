import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Ear, EarFill, Pencil, PencilFill } from 'react-bootstrap-icons'

import { Keyword, DataOptions, WordUse } from '../types'

import {
  convertCharToState,
  useUpdateCharBasedOnYear,
} from '../utils/convertCharToState'
import getPronunciation from '../utils/getPronunciation'
import { notOutOfBounds, calculateOpacity } from '../utils/appearance-utils'
import './WordOverview.css'

const iconColor = '#43456d'
const Spacer = () => <span style={{ marginRight: '6px' }} />

const WordOverview = ({
  measuredRef,
  sidePaneMode,
  setSidePaneMode,
  wordState,
  setWordState,
  initialState,
}: {
  measuredRef: (node: HTMLDivElement | null) => void
  sidePaneMode: null | 'pronunciation' | 'inflection'
  setSidePaneMode: Dispatch<
    SetStateAction<null | 'pronunciation' | 'inflection'>
  >
  wordState: DataOptions[]
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
  initialState: DataOptions[]
}) => {
  if (!wordState) throw new Error('Hiba történt. Kérjük, próbálkozz később.')

  // Setting up state.
  const [currentYear, setCurrentYear] = useState(2000)
  const [pronunciationHover, setPronunciationHover] = useState(false)
  const [inflectionHover, setInflectionHover] = useState(false)

  const [activeRules, setActiveRules] = useState<object[]>([])

  const [pronunciation, setPronunciation] = useState<
    {
      pron: string[]
      numberOfVariants: number
    }[]
  >([{ pron: [], numberOfVariants: 0 }])

  console.log(wordState)

  // TypeScript doesn't seem to allow the type guard with the regular "filter" function.
  const keywordList: Keyword[] = wordState.flatMap(wordObject =>
    'word' in wordObject && notOutOfBounds(wordObject, currentYear)
      ? wordObject
      : []
  )

  const useList: WordUse[] = wordState.flatMap(wordObject =>
    'meaning' in wordObject && notOutOfBounds(wordObject, currentYear)
      ? wordObject
      : []
  )

  //  To-Do: make this into the main hook that updates state for the card?
  // Setting up the scroll / year connection.
  useEffect(() => {
    // setPronunciation(getPronunciation(wordState, currentYear))

    const handleScroll = () => {
      setCurrentYear(2000 + Math.floor(window.scrollY / 10))
      // setPronunciation(getPronunciation(wordState, currentYear))
      // setWordState(prev => [
      //   ...prev.map(item => {
      //     if ('word' in item) {
      //       return {
      //         ...item,
      //         pronunciation: getPronunciation(wordState, currentYear),
      //       }
      //     } else return item
      //   }),
      // ])
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [currentYear])

  useUpdateCharBasedOnYear(initialState, setWordState, currentYear)

  // setPronunciation(wordState.filter(elem => 'main' in elem))

  // A dynamic style attribute that shows a yellow flash when an element appears.
  // Has to be placed next to the element (which should have the className "flash"), at the same level.
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

  // 2010: main: kɒpcsos +1 -> ɒ ~ ɑ (kɑpcsos)
  // 2051: main: kɑpcsos +1 -> ɑ ~ ɒ (kɒpcsos)
  // 2060: main: kɑpcsos + 2 -> ɑ ~ ɒ (kɒpcsos), ɑ ~ ä (käpcsos)
  // 2081: main: kɑpcsos + 1 -> ɑ ~ ä (käpcsos)

  // The main return on the WordOverview component.
  return (
    <Card ref={measuredRef} className='word-overview-card'>
      <Card.Header className='p-0' style={{ backgroundColor: '#fafbfe' }}>
        <Card.Title as='h3' className='px-3 pt-3'>
          {keywordList.map((wordObject, index) => (
            <React.Fragment key={wordObject.word}>
              <Flash />
              <span
                className='flash'
                style={{
                  color: `rgba(0, 0, 0, ${calculateOpacity(
                    wordObject,
                    currentYear
                  )}`,
                }}
              >
                {index > 0 && ' / '}
                {wordObject.word}
              </span>
            </React.Fragment>
          ))}
        </Card.Title>
        <div>
          <Card.Subtitle
            className={`side-pane-opener mx-2 px-2 pt-1 pb-2 mb-1 ${
              pronunciationHover ? '#43456d' : 'text-muted'
            }`}
            onMouseEnter={() => setPronunciationHover(true)}
            onMouseLeave={() => setPronunciationHover(false)}
            onClick={() =>
              sidePaneMode === 'pronunciation'
                ? setSidePaneMode(null)
                : setSidePaneMode('pronunciation')
            }
          >
            {pronunciationHover ? (
              <EarFill color={iconColor} />
            ) : (
              <Ear color={iconColor} />
            )}
            <Spacer />
            {/* {pronunciation.map((pronVersion, index) => (
              <div key={index}>
                <span>
                  {index > 0 && ' / '}
                  {`[${pronVersion.main.join('')}]`}
                </span>
                {!!pronVersion.numberOfVariants && (
                  <span
                    className='number-of-variants'
                    // onClick={() => console.log(actRules)}
                  >{`(+${pronVersion.numberOfVariants})`}</span>
                )}
              </div>
            ))} */}
            {wordState.map(
              (wordObject, index) =>
                'main' in wordObject && (
                  <div key={index}>
                    <span>
                      {index > 0 && ' / '}
                      {`[${wordObject?.main}]`}
                    </span>
                    {!!wordObject.numberOfVariants && (
                      <span
                        className='number-of-variants'
                        // onClick={() => console.log(actRules)}
                      >{`(+${wordObject.numberOfVariants})`}</span>
                    )}
                  </div>
                )
            )}
          </Card.Subtitle>
        </div>
        <Card.Subtitle
          className={`side-pane-opener mx-2 px-2 pt-1 pb-2 mb-1 ${
            inflectionHover ? '#43456d' : 'text-muted'
          }`}
          onMouseEnter={() => setInflectionHover(true)}
          onMouseLeave={() => setInflectionHover(false)}
          onClick={() =>
            sidePaneMode === 'inflection'
              ? setSidePaneMode(null)
              : setSidePaneMode('inflection')
          }
        >
          {inflectionHover ? (
            <PencilFill color={iconColor} />
          ) : (
            <Pencil color={iconColor} />
          )}
          <Spacer />
          {wordState.map(wordObject =>
            'partOfSpeech' in wordObject ? (
              <span key={wordObject.partOfSpeech}>
                {wordObject.partOfSpeech}
              </span>
            ) : null
          )}
        </Card.Subtitle>
      </Card.Header>
      <Card.Body className='p-0'>
        <ListGroup as='ol' variant='flush' numbered>
          {useList.map(wordObject => (
            <React.Fragment key={wordObject.meaning}>
              <Flash />
              <ListGroup.Item
                as='li'
                className='fs-5 p-3 d-flex align-items-start flash'
                style={{
                  color: `rgba(0, 0, 0, ${calculateOpacity(
                    wordObject,
                    currentYear
                  )}`,
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
                              wordObject,
                              currentYear
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
