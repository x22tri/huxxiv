import { useState, useCallback, Dispatch, SetStateAction } from 'react'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { ActivePane, Word } from '../types'
import { KeywordRow, YearsBG, TabNavigation } from './SearchResultsComponents'
import MeaningPane from './MeaningPane'
import PronunciationPane from './PronunciationPane'
import InflectionPane from './InflectionPane'
import { useNoFlashOnMount } from '../utils/useNoFlashOnMount'
import { useUpdateCharBasedOnYear } from '../utils/useUpdateCharBasedOnYear'

import './SearchResults.css'
import { notOutOfBounds } from '../utils/appearance-utils'

const SearchResults = ({
  activePane,
  initialState,
  setActivePane,
  setWordState,
  wordState,
}: {
  activePane: ActivePane
  initialState: Word
  wordState: Word
  setActivePane: Dispatch<SetStateAction<ActivePane>>
  setWordState: Dispatch<SetStateAction<Word>>
}) => {
  const preventFlashOnMount = useNoFlashOnMount()

  // The core of HUXXIV's business logic, a hook that updates the card on scroll.
  let year = useUpdateCharBasedOnYear(initialState, wordState, setWordState)

  // This is used to make sure the first year, '2000', is displayed at the middle of the card.
  const [cardHeight, setCardHeight] = useState<number>(0)
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setCardHeight(node.getBoundingClientRect().height)
  }, [])

  const useList = wordState.meanings.filter(m => notOutOfBounds(m, year))

  const {
    activeSoundChanges,
    mainPronunciation,
    partOfSpeech,
    vowelHarmony,
    classes,
    word,
  } = wordState

  return (
    <Container fluid id='word-overview-container'>
      <p id='scroll-down-prompter'>
        ↓ Görgess lefelé a szó fejlődésének megtekintéséhez ↓
      </p>
      <YearsBG {...{ cardHeight }} />
      <Row id='fixed-row'>
        <Card id='search-results-card' className='px-0' ref={measuredRef}>
          <Card.Header className='p-0' id='search-results-card-header'>
            <KeywordRow {...{ word, preventFlashOnMount, year }} />
            <hr />
            <TabNavigation
              {...{
                activePane,
                setActivePane,
                mainPronunciation,
                activeSoundChanges,
                word,
                partOfSpeech,
                useList,
                year,
              }}
            />
          </Card.Header>
          {/* The following is essentially a switch statement that renders the right component based on activePane. */}
          {
            {
              meaning: <MeaningPane {...{ useList, year }} />,
              pronunciation: (
                <PronunciationPane
                  {...{ activeSoundChanges, mainPronunciation, year }}
                />
              ),
              inflection: (
                <InflectionPane
                  {...{
                    word,
                    partOfSpeech,
                    year,
                    vowelHarmony,
                    classes,
                  }}
                />
              ),
            }[activePane]
          }
        </Card>
      </Row>
    </Container>
  )
}

export default SearchResults
