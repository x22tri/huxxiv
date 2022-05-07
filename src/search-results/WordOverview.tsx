import React, { useState, useEffect, useCallback } from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import {
  Keyword,
  WordUse,
  Word,
  Phonemic,
  PhoneticVariant,
  Changeable,
} from '../types'

import { RULES } from '../database/RULES'

import convertCharToState from '../utils/convertCharToState'
import './WordOverview.css'

const WordOverview = ({
  measuredRef,
  word,
}: {
  measuredRef: (node: HTMLDivElement | null) => void
  word: Word
}) => {
  // Setting up localized strings.
  const alwaysShown = 'Mindig látható'
  const notReachedYet = 'Még nincs elérve'
  const gonePast = 'Meghaladva'
  const appearanceInProgress = 'Újonnan megjelenő elem'
  const disappearanceInProgress = 'Eltűnő elem'
  const concurrentVariants = 'Egyenértékű változatok'

  // Setting up state.
  const [currentYear, setCurrentYear] = useState(2000)
  const [wordState] = useState(convertCharToState(word)) // This will be a fetch call.

  const phonemicList: Phonemic[] = wordState.flatMap(wordObject =>
    'phonemic' in wordObject ? wordObject : []
  )

  // const [phonemic, setPhonemic] = useState<string[][]>(
  //   phonemicList.map(wordObject => wordObject.phonemic)
  // )

  const phonemic = phonemicList.map(wordObject => wordObject.phonemic)

  const [activeRules, setActiveRules] = useState<object[]>([])

  const [pronunciation, setPronunciation] = useState<
    (string | PhoneticVariant)[][]
  >(
    // phonemicList.map(wordObject => wordObject.phonemic.join(''))
    [...phonemic]
  )

  // The function that shows the status of an element based on the current year.
  // It is used to make obsolete elements disappear and new elements appear.
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

  // To-Do: convert getPron and similar functions to hooks and have the card take the state from it and just display it

  // Setting up the scroll / year connection.
  useEffect(() => {
    const handleScroll = () => {
      setCurrentYear(2000 + Math.floor(window.scrollY / 10))

      const testGetPron = () => {
        const initialPronunciation: (string | PhoneticVariant)[][] = JSON.parse(
          JSON.stringify(phonemic)
        )

        initialPronunciation.forEach(phonemicVariant => {
          RULES.forEach(rule => {
            phonemicVariant.forEach((phoneme, index) => {
              // console.log(
              //   'target: ' +
              //     rule.target +
              //     ', phoneme: ' +
              //     phoneme +
              //     ', change: ' +
              //     rule.change
              // )
              if (rule.target === phoneme && rule.change) {
                switch (handleAppear(rule)) {
                  case appearanceInProgress:
                    phonemicVariant[index] = {
                      main: rule.target,
                      new: rule.change,
                      appears: rule.appears,
                    }
                    // !actRules.includes(rule) && actRules.push(rule)
                    break
                  case notReachedYet:
                    phonemicVariant[index] = rule.target
                    // actRules.includes(rule) && actRules.splice(actRules.indexOf(rule))
                    break
                  case gonePast:
                    phonemicVariant[index] = rule.change
                    // actRules.includes(rule) && actRules.splice(actRules.indexOf(rule))
                    break
                  case disappearanceInProgress:
                    phonemicVariant[index] = {
                      main: rule.change,
                      old: rule.target,
                      disappears: rule.disappears,
                    }
                    // !actRules.includes(rule) && actRules.push(rule)
                    break
                }
              }
            })
          })
        })
        return initialPronunciation
      }
      setPronunciation(testGetPron)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleAppear, phonemic])

  console.log(pronunciation)

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

  const getPronunciation = (
    phonemic: string[]
  ): [string[], number, object[]] => {
    const initialPronunciation: (string | PhoneticVariant)[] = [...phonemic]
    const actRules: object[] = []

    RULES.forEach(rule => {
      initialPronunciation.forEach((phoneme, index) => {
        if (rule.target === phoneme && rule.change) {
          switch (handleAppear(rule)) {
            case appearanceInProgress:
              initialPronunciation[index] = {
                main: rule.target,
                new: rule.change,
                appears: rule.appears,
              }
              !actRules.includes(rule) && actRules.push(rule)
              break
            case notReachedYet:
              initialPronunciation[index] = rule.target
              actRules.includes(rule) && actRules.splice(actRules.indexOf(rule))
              break
            case gonePast:
              initialPronunciation[index] = rule.change
              actRules.includes(rule) && actRules.splice(actRules.indexOf(rule))
              break
            case disappearanceInProgress:
              initialPronunciation[index] = {
                main: rule.change,
                old: rule.target,
                disappears: rule.disappears,
              }
              !actRules.includes(rule) && actRules.push(rule)
              break
          }
        }
      })
    })

    return [
      initialPronunciation.map(phoneme =>
        typeof phoneme === 'string' ? phoneme : phoneme.main
      ),
      initialPronunciation.filter(phoneme => typeof phoneme === 'object')
        .length, // the number of variants
      actRules,
    ]

    // code v2:
    // check all rules for all phonemes in Phonemic
    // (phonemes in targets, as well as phonemes in "change" attributes with currentYear < disappears[1])
    // for every phoneme, if it has neither an "appears" or a "disappears", display it normally
    // if it has "disappears" but no "appears", throw error (a phoneme cannot disappear without something else taking its place?)
    // if it has "appears", add +1 if currentYear >= appears[0] (&& currentYear < disappears[1])
    // (i.e. if handleAppear = true)
    // clicking on +1 displays in a separate component like "target ~ change" (e.g. "ɒ ~ ɑ") and "note" if present.
    // if currentYear < appears[1], display new main pronunciation (replace target with change in Phonemic?)
    // and make it the basis of new changes
  }

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
          &nbsp;
          <span className='fs-6 text-muted'>
            {wordState.map(wordObject =>
              'partOfSpeech' in wordObject ? (
                <span key={wordObject.partOfSpeech}>
                  {wordObject.partOfSpeech}
                </span>
              ) : null
            )}
          </span>
        </Card.Title>
        <Card.Subtitle className='px-3 pb-2 text-muted'>
          {phonemic.map((wordObject, index) => {
            let [mainPronunciation, numberOfVariants, actRules] =
              getPronunciation(wordObject)
            return (
              // <span key={wordObject.phonemic.join('')}>
              //   {index > 0 && ' / '}/{wordObject.phonemic.join('')}/
              // </span>
              <div key={index}>
                <span>{mainPronunciation}</span>
                {!!numberOfVariants && (
                  <span
                    className='number-of-variants'
                    onClick={() => console.log(actRules)}
                  >{`(+${numberOfVariants})`}</span>
                )}
              </div>
            )
          })}
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
