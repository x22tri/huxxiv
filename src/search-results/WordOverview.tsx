import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Ear, EarFill, Pencil, PencilFill } from 'react-bootstrap-icons'

import {
  Keyword,
  DataOptions,
  WordUse,
  Word,
  Phonemic,
  PhoneticVariant,
  Changeable,
} from '../types'

import { RULES } from '../database/RULES'

import convertCharToState from '../utils/convertCharToState'
import getPronunciation from '../utils/getPronunciation'
import './WordOverview.css'

const WordOverview = ({
  measuredRef,
  sidePaneMode,
  setSidePaneMode,
  wordState,
  setWordState,
}: {
  measuredRef: (node: HTMLDivElement | null) => void
  sidePaneMode: null | 'pronunciation' | 'inflection'
  setSidePaneMode: Dispatch<
    SetStateAction<null | 'pronunciation' | 'inflection'>
  >
  wordState: undefined | DataOptions[]
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
}) => {
  if (!wordState) throw new Error('Hiba történt. Kérjük, próbálkozz később.')

  // Setting up localized strings.
  const alwaysShown = 'Mindig látható'
  const notReachedYet = 'Még nincs elérve'
  const gonePast = 'Meghaladva'
  const appearanceInProgress = 'Újonnan megjelenő elem'
  const disappearanceInProgress = 'Eltűnő elem'
  const concurrentVariants = 'Egyenértékű változatok'

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

  // console.log(pronunciation)

  // console.log(wordState)

  // The function that shows the status of an element based on the current year.
  // It is used to make obsolete elements disappear and new elements appear.
  // To-Do: move to getPronunciation, make it into a hook?
  const handleAppear = useCallback(
    (dataObject: Changeable) =>
      !dataObject.appears && !dataObject.disappears
        ? alwaysShown
        : dataObject.appears && dataObject.appears[0] > currentYear
        ? notReachedYet
        : dataObject.appears && dataObject.appears[1] > currentYear
        ? appearanceInProgress
        : dataObject.disappears && dataObject.disappears[1] < currentYear
        ? gonePast
        : dataObject.disappears && dataObject.disappears[0] < currentYear
        ? disappearanceInProgress
        : concurrentVariants,
    [currentYear]
  )

  // An auxiliary function that calls handleAppear and returns true if the element is always shown or currently active,
  // and false otherwise.
  const notOutOfBounds = (dataObject: Changeable): boolean =>
    handleAppear(dataObject) !== notReachedYet &&
    handleAppear(dataObject) !== gonePast

  // TypeScript doesn't seem to allow the type guard with the regular "filter" function.
  const keywordList: Keyword[] = wordState.flatMap(wordObject =>
    'word' in wordObject && notOutOfBounds(wordObject) ? wordObject : []
  )

  const useList: WordUse[] = wordState.flatMap(wordObject =>
    'meaning' in wordObject && notOutOfBounds(wordObject) ? wordObject : []
  )

  //  To-Do: make this into the main hook that updates state for the card?
  // Setting up the scroll / year connection.
  useEffect(() => {
    setPronunciation(getPronunciation(wordState, handleAppear))

    const handleScroll = () => {
      setCurrentYear(2000 + Math.floor(window.scrollY / 10))
      setPronunciation(getPronunciation(wordState, handleAppear))
      // setWordState(prev => [
      //   ...prev,
      //   { pronunciation: getPronunciation(wordState, handleAppear) },
      // ]) ---- This currently adds a new {pronunciation: ...} object on every scroll.
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [wordState, handleAppear])

  // console.log(pronunciation)

  // The function that calculates an element's opacity based on when it appears / disappears from the language.
  const calculateOpacity = (dataObject: Changeable): number | undefined => {
    if (!dataObject.appears && !dataObject.disappears) return 1
    else {
      const minimumOpacity = 0.2
      const type = dataObject.appears ?? dataObject.disappears

      const calculatorFunc = (start: number, end: number): number =>
        (currentYear - start) / (end - start)

      const clamp = (num: number, min: number, max: number, rev: boolean) => {
        const result = !rev ? num : 1 - num
        return result <= min ? min : result >= max ? max : result
      }

      if (!type) throw new Error('Hiba: a beérkező adat rossz szerkezetű.')
      else
        return clamp(
          calculatorFunc(type[0], type[1]),
          minimumOpacity,
          1,
          type === dataObject.disappears
        )
    }
  }

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
              <EarFill color='#43456d' />
            ) : (
              <Ear color='#43456d' />
            )}
            <span style={{ marginRight: '6px' }} />
            {pronunciation.map((pronVersion, index) => (
              <div key={index}>
                <span>
                  {index > 0 && ' / '}
                  {`[${pronVersion.pron.join('')}]`}
                </span>
                {!!pronVersion.numberOfVariants && (
                  <span
                    className='number-of-variants'
                    // onClick={() => console.log(actRules)}
                  >{`(+${pronVersion.numberOfVariants})`}</span>
                )}
              </div>
            ))}
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
            <PencilFill color='#43456d' />
          ) : (
            <Pencil color='#43456d' />
          )}
          <span style={{ marginRight: '6px' }} />
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
