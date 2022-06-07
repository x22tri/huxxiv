import { useState, useCallback, Dispatch, SetStateAction } from 'react'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { ActivePane, DataOptions, Keyword, Inflection, WordUse } from '../types'
import { KeywordRow, YearsBG, TabNavigation } from './SearchResultsComponents'
import MeaningPane from './MeaningPane'
import PronunciationPane from './PronunciationPane'
import InflectionPane from './InflectionPane'
import { notOutOfBounds } from '../utils/appearance-utils'
import { useNoFlashOnMount } from '../utils/useNoFlashOnMount'
import { useUpdateCharBasedOnYear } from '../utils/useUpdateCharBasedOnYear'

import './SearchResults.css'

const SearchResults = ({
  activePane,
  initialState,
  setActivePane,
  setWordState,
  wordState,
}: {
  activePane: ActivePane
  initialState: DataOptions[]
  wordState: DataOptions[]
  setActivePane: Dispatch<SetStateAction<ActivePane>>
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
}) => {
  const preventFlashOnMount = useNoFlashOnMount()

  // The core of HUXXIV's business logic, a hook that updates the card on scroll.
  let year = useUpdateCharBasedOnYear(initialState, setWordState)

  // This is used to make sure the first year, '2000', is displayed at the middle of the card.
  const [cardHeight, setCardHeight] = useState<number>(0)
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setCardHeight(node.getBoundingClientRect().height)
  }, [])

  // A list of type guards.
  // TypeScript doesn't seem to allow the type guard with the regular "filter" function.
  const keywordList: Keyword[] = wordState.flatMap(wordObject =>
    'word' in wordObject && notOutOfBounds(wordObject, year) ? wordObject : []
  )

  const mainKeyword: Keyword | undefined =
    keywordList.length === 1
      ? keywordList[0]
      : keywordList.find(word => 'main' in word && word.main === true)
  if (!mainKeyword) throw new Error('Nincs megadva fő kulcsszó.')

  const useList: WordUse[] = wordState.flatMap(wordObject =>
    'meaning' in wordObject && notOutOfBounds(wordObject, year)
      ? wordObject
      : []
  )

  const inflection: Inflection = wordState.find(
    wordObject => 'partOfSpeech' in wordObject
  ) as Inflection

  return (
    <Container fluid id='word-overview-container'>
      <p id='scroll-down-prompter'>
        ↓ Görgess lefelé a szó fejlődésének megtekintéséhez ↓
      </p>
      <YearsBG {...{ cardHeight }} />
      <Row id='fixed-row'>
        <Card id='search-results-card' className='px-0' ref={measuredRef}>
          <Card.Header className='p-0' id='search-results-card-header'>
            <KeywordRow {...{ mainKeyword, preventFlashOnMount, year }} />
            <hr />
            <TabNavigation
              {...{
                activePane,
                setActivePane,
                mainKeyword,
                inflection,
                useList,
              }}
            />
          </Card.Header>
          {/* The following is essentially a switch statement that renders the right component based on activePane. */}
          {
            {
              meaning: <MeaningPane {...{ useList, year }} />,
              pronunciation: (
                <PronunciationPane
                  pron={mainKeyword.concurrentPronunciations}
                  {...{ year }}
                />
              ),
              inflection: (
                <InflectionPane {...{ inflection, mainKeyword, year }} />
              ),
            }[activePane]
          }
        </Card>
      </Row>
    </Container>
  )
}

export default SearchResults
