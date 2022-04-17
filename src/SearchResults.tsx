import { useState, useEffect, useCallback } from 'react'
import { deepmerge, deepmergeCustom } from 'deepmerge-ts'
import merge from 'ts-deepmerge'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Stack from 'react-bootstrap/Stack'

import { LaterDevelopments, Word, WordUse } from './CHARS'
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

  // console.log(wordState.latestUpdate)

  // On downscrolls where new development dates are passed, these developments are added.
  // On upscrolls where new development dates (-1) are passed, these developments are removed.
  const checkForDevelopmentsPassed = useCallback(
    (scrollDirection: 'up' | 'down') => {
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
          console.log(newDevelopments)
          newDevelopments.forEach(development => {
            setWordState(prevState => ({
              ...prevState,
              date: development.date!,
            }))

            // let newDevelopmentMergable: WordState = development as WordState

            // const stateCopy = JSON.parse(JSON.stringify(wordState))

            const merged = merger(
              JSON.parse(JSON.stringify(wordState)),
              development
            ) as any as WordState

            // const coerced = merged

            console.log(merged)

            setWordState(merged)

            // const mergeIntoLatter = <
            //   T extends keyof WordState,
            //   NestedKey extends keyof T
            // >(
            //   firstObj: Partial<WordState> | keyof Partial<WordState>,
            //   secondObj: WordState | keyof WordState
            // ): void => {
            //   Object.entries(firstObj).forEach(([key, value]) => {
            //     if (secondObj[key as NestedKey] === undefined) {
            //       secondObj[key] = value
            //     } else if (typeof value === 'object') {
            //       mergeIntoLatter(
            //         firstObj[key as keyof typeof firstObj],
            //         secondObj[key as keyof typeof secondObj]
            //       )
            //     }
            //   })
            // }
            // mergeIntoLatter(development, stateCopy)

            // const customDeepmerge = deepmergeCustom<WordState, LaterDevelopments>({})

            // let newDevTest: Partial<WordState> = development

            // const customDeepmerge = (
            //   state: WordState,
            //   newDev: WordState
            // ): WordState => {
            //   return deepmerge(state, newDev)
            // }
            // wordState.latestUpdate = development.date

            // // const mergedDev = customDeepmerge(wordState, newDevFull)
            // const customDeepmerge = deepmergeCustom({})

            // const mergedDev = merge(stateCopy, development)
            // console.log(mergedDev)

            // const mergedDev = deepmerge(wordState, newDevFull)
            // console.log(mergedDev)
            // setWordState(mergedDev)
            // console.log(mergedDev)
            // console.log(typeof mergedDev.id)
            // console.log(typeof wordState.id)

            //   for (const property in development) {
            //     if (property === 'date') continue
            //     else {
            //       let attribute =
            //         development[property as keyof typeof development]
            // To-Do: override word, inflectionType, etc. (strings and numbers)
            // Arrays are merged with the word state's current arrays.
            // if (property === 'use' && Array.isArray(attribute)) {
            //   attribute.forEach((element) => {
            //     let nestedAttribute = wordState[
            //       property as keyof typeof wordState
            //     ] as WordUse[]
            //     console.log(element)
            //   let findItemToUpdate = () => {
            //     return nestedAttribute.find(
            //         (use) => use.useId === element.useId
            //       )
            //   }
            //   if (element.event === 'obsolete') {
            //     if (findItemToUpdate() !== undefined) {
            //       throw new Error('Hiba a bejegyzésben: nem frissíthető egy olyan értelem, amely eddig nem lett bevezetve.')
            //     } else {
            //     setWordState((prevState) => ({
            //             ...prevState,
            //             [property]: [
            //               ...nestedAttribute.filter(
            //                 (item) => item.useId !== findItemToUpdate()!.useId
            //               ),
            //             ],
            //           }))
            //   }
            // }
            // Find updates to uses already present on the card.
            // let foundItemToUpdate = nestedAttribute.find(
            //   (use) => use.useId === element.useId
            // )
            // if (foundItemToUpdate) {
            // Obsolete words are removed from the card.
            // if (element.event === 'obsolete') {
            //   setWordState((prevState) => ({
            //     ...prevState,
            //     [property]: [...(nestedAttribute || []), element],
            //   }))
            // }
            // for (const useProperty in element) {
            // let useAttribute = element[
            //   useProperty as keyof typeof element
            // ]
            // foundItemToUpdate[useProperty as keyof typeof element] = element[useProperty as keyof typeof element]
            // }
            // } else {
            //   setWordState((prevState) => ({
            //     ...prevState,
            //     [property]: [...(nestedAttribute || []), element],
            //   }))
            // }
            //     })
            //   } else {
            //     console.log('misc')
            //   }
            // }
            // }
          })
        }
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

  // console.log(currentYear)

  // console.log(wordState)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // console.log(scrollDirection)

  // useEffect(() => {
  //   // const scrollDirection

  //   let newDevelopments: Partial<Word>[] = word.laterDevelopments.filter(
  //     (development) => development.date === currentYear
  //   )

  //   if (newDevelopments) {
  //     console.log(newDevelopments)
  //   }
  // }, [currentYear, word.laterDevelopments])

  return (
    <Card
      ref={measuredRef}
      className='word-overview-card'
      style={{
        position: 'fixed',
      }}
    >
      <Card.Body>
        <Card.Title as='h3'>{wordState.word}</Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>
          {wordState.partOfSpeech}
        </Card.Subtitle>
        <ListGroup as='ol' variant='flush' numbered>
          {wordState.use.map(element => {
            // console.log(element)

            return (
              <ListGroup.Item as='li' className='fs-5' key={element.useId}>
                <>
                  {element.meaning}
                  {element.examples &&
                    element.examples.map((example, index) => (
                      <div className='text-muted fs-6' key={index}>
                        {example}
                      </div>
                    ))}
                </>
              </ListGroup.Item>
            )
          })}
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
