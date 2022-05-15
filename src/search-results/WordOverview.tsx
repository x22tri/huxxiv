import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Ear, EarFill, Pencil, PencilFill } from 'react-bootstrap-icons'

import { Keyword, DataOptions, WordUse, PhoneticVariant } from '../types'

import { useUpdateCharBasedOnYear } from '../utils/convertCharToState'
import { notOutOfBounds, calculateOpacity } from '../utils/appearance-utils'
import './WordOverview.css'

const startingYear = 2000
const iconColor = '#43456d'
const Spacer = () => <span style={{ marginRight: '6px' }} />

const getMainPronunciation = (phoneticVariant: (string | PhoneticVariant)[]) =>
  phoneticVariant
    .map(phoneme => (typeof phoneme === 'string' ? phoneme : phoneme.main))
    .join('')

const getNumberOfVariants = (phoneticVariant: (string | PhoneticVariant)[]) =>
  phoneticVariant.filter(element => typeof element === 'object').length

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
  const [year, setYear] = useState(startingYear)
  const [pronunciationHover, setPronunciationHover] = useState(false)
  const [inflectionHover, setInflectionHover] = useState(false)

  // const [activeRules, setActiveRules] = useState<object[]>([])

  console.log(wordState)

  // Setting up the scroll / year connection.
  useEffect(() => {
    const handleScroll = () => {
      setYear(startingYear + Math.floor(window.scrollY / 10))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [year])

  useUpdateCharBasedOnYear(initialState, setWordState, year)

  // TypeScript doesn't seem to allow the type guard with the regular "filter" function.
  const keywordList: Keyword[] = wordState.flatMap(wordObject =>
    'word' in wordObject && notOutOfBounds(wordObject, year) ? wordObject : []
  )

  const useList: WordUse[] = wordState.flatMap(wordObject =>
    'meaning' in wordObject && notOutOfBounds(wordObject, year)
      ? wordObject
      : []
  )

  const phoneticList: (string | PhoneticVariant)[][] = keywordList.map(elem =>
    'concurrentPronunciations' in elem ? elem.concurrentPronunciations! : []
  )

  // A dynamic style attribute that shows a yellow flash when an element appears.
  // Has to be placed next to the element (which should have the className "flash"), at the same level.
  const Flash = () => (
    <style type='text/css'>
      {`.flash {
            border-radius: 4px;
            animation: yellow-fade ${year === 2000 ? 0 : 0.5}s ease-in-out 0s;
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
        {/* Keyword */}
        <Card.Title as='h3' className='px-3 pt-3'>
          {keywordList.map((wordObject, index) => (
            <React.Fragment key={wordObject.word}>
              <Flash />
              <span
                className='flash'
                style={{
                  color: `rgba(0, 0, 0, ${calculateOpacity(wordObject, year)}`,
                }}
              >
                {index > 0 && ' / '}
                {wordObject.word}
              </span>
            </React.Fragment>
          ))}
        </Card.Title>

        {/* Main pronunciation (opens pronunciation pane on click) */}
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
        </Card.Subtitle>

        {/* Part of Speech (opens inflection pane on click) */}
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

      {/* Meanings and example sentences */}
      <Card.Body className='p-0'>
        <ListGroup as='ol' variant='flush' numbered>
          {useList.map(wordObject => (
            <React.Fragment key={wordObject.meaning}>
              <Flash />
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
            </React.Fragment>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default WordOverview
