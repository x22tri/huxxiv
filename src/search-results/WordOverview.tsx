import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Ear, EarFill, Pencil, PencilFill } from 'react-bootstrap-icons'

import {
  Keyword,
  ConcurrentPronunciation,
  DataOptions,
  WordUse,
} from '../types'

import { useUpdateCharBasedOnYear } from '../utils/convertCharToState'
import { notOutOfBounds, calculateOpacity } from '../utils/appearance-utils'
import {
  getMainPronunciation,
  getNumberOfVariants,
} from '../utils/getPronunciation'
import './WordOverview.css'
import {
  usePreventFlashOnMount,
  Flasher,
} from '../utils/usePreventFlashOnMount'
import useChangeYearOnScroll from '../utils/useChangeYearOnScroll'

const iconColor = '#43456d'
const Spacer = () => <span style={{ marginRight: '6px' }} />

const WordOverview = ({
  measuredRef,
  // sidePaneMode,
  // setSidePaneMode,
  wordState,
  setWordState,
  initialState,
}: // year,
// setYear,
// startingYear,
{
  measuredRef: (node: HTMLDivElement | null) => void
  sidePaneMode: 'meaning' | 'pronunciation' | 'inflection'
  setSidePaneMode: Dispatch<
    SetStateAction<'meaning' | 'pronunciation' | 'inflection'>
  >
  wordState: DataOptions[]
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
  initialState: DataOptions[]
  // year: number
  // setYear: Dispatch<SetStateAction<number>>
  // startingYear: number
}) => {
  if (!wordState) throw new Error('Hiba történt. Kérjük, próbálkozz később.')

  const preventFlashOnMount = usePreventFlashOnMount()

  // Setting up state.
  // const [pronunciationHover, setPronunciationHover] = useState(false)
  // const [inflectionHover, setInflectionHover] = useState(false)

  let year = useChangeYearOnScroll()
  useUpdateCharBasedOnYear(initialState, setWordState, year)

  // TypeScript doesn't seem to allow the type guard with the regular "filter" function.
  // const keywordList: Keyword[] = wordState.flatMap(wordObject =>
  //   'word' in wordObject && notOutOfBounds(wordObject, year) ? wordObject : []
  // )

  const useList: WordUse[] = wordState.flatMap(wordObject =>
    'meaning' in wordObject && notOutOfBounds(wordObject, year)
      ? wordObject
      : []
  )

  // const phoneticList: (string | ConcurrentPronunciation)[][] = keywordList.map(
  //   elem =>
  //     elem['concurrentPronunciations'] ? elem.concurrentPronunciations : []
  // )

  // 2010: main: kɒpcsos +1 -> ɒ ~ ɑ (kɑpcsos)
  // 2051: main: kɑpcsos +1 -> ɑ ~ ɒ (kɒpcsos)
  // 2060: main: kɑpcsos + 2 -> ɑ ~ ɒ (kɒpcsos), ɑ ~ ä (käpcsos)
  // 2081: main: kɑpcsos + 1 -> ɑ ~ ä (käpcsos)

  // The main return on the WordOverview component.
  return (
    <div ref={measuredRef} id='word-overview-card'>
      {/* <Card.Header className='p-0' style={{ backgroundColor: '#fafbfe' }}> */}
      {/* Keyword */}
      {/* <Card.Title as='h3' className='px-3 pt-3'>
          {keywordList.map((wordObject, index) => (
            <Flasher key={wordObject.word} {...{ preventFlashOnMount }}>
              <span
                className='flash'
                style={{
                  color: `rgba(0, 0, 0, ${calculateOpacity(wordObject, year)}`,
                }}
              >
                {index > 0 && ' / '}
                {wordObject.word}
              </span>
            </Flasher>
          ))}
        </Card.Title> */}

      {/* Main pronunciation (opens pronunciation pane on click) */}
      {/* <Card.Subtitle
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
          {phoneticList.map((wordObject, index) => {
            return (
              <div key={index}>
                {index > 0 && <span style={{ margin: '0 5px' }}>/</span>}
                <span>{`[${getMainPronunciation(wordObject)}]`}</span>
                {!!getNumberOfVariants(wordObject) && (
                  <span
                    className='number-of-variants'
                    // onClick={() => console.log(actRules)}
                  >{`(+${getNumberOfVariants(wordObject)})`}</span>
                )}
              </div>
            )
          })}
        </Card.Subtitle> */}

      {/* Part of Speech (opens inflection pane on click) */}
      {/* <Card.Subtitle
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
      </Card.Header> */}

      {/* Meanings and example sentences */}
      <Card.Body className='p-0'>
        <ListGroup as='ol' variant='flush' numbered>
          {useList.map(wordObject => (
            <Flasher key={wordObject.meaning} {...{ preventFlashOnMount }}>
              <ListGroup.Item
                as='li'
                className='fs-5 p-3 d-flex align-items-start flash'
                style={{
                  color: `rgba(0, 0, 0, ${calculateOpacity(wordObject, year)}`,
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
                              year
                            )}`,
                          }}
                        >
                          {example}
                        </div>
                      ))}
                  </div>
                </div>
              </ListGroup.Item>
            </Flasher>
          ))}
        </ListGroup>
      </Card.Body>
    </div>
  )
}

export default WordOverview
