import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react'

import CardGroup from 'react-bootstrap/CardGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'

import { DataOptions } from '../types'
import WordOverview from './WordOverview'
import PronunciationPane from './PronunciationPane'
import './SearchResults.css'

const startingYear = 2000
// const flashWhenParentNotMounted = true ? 'flash' : undefined

const SearchResults = ({
  wordState,
  setWordState,
}: {
  wordState: DataOptions[]
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
}) => {
  const [year, setYear] = useState(startingYear)
  const [cardHeight, setCardHeight] = useState(0)
  const [sidePaneMode, setSidePaneMode] = useState<
    null | 'pronunciation' | 'inflection'
  >(null)

  // This state provides an immutable starting point for all phonetic etc. processes.
  const [initialState] = useState(wordState)

  // This is used to make sure '2000' is displayed at the middle of the card.
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setCardHeight(node.getBoundingClientRect().height)
  }, [])

  return (
    <Container fluid id='word-overview-container'>
      <p id='scroll-down-prompter'>
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
      <Row id='fixed-row'>
        <CardGroup id='search-results-card-group'>
          <WordOverview
            {...{
              measuredRef,
              sidePaneMode,
              setSidePaneMode,
              wordState,
              setWordState,
              initialState,
              year,
              setYear,
              startingYear,
            }}
          />
          {sidePaneMode === 'pronunciation' && (
            <PronunciationPane {...{ sidePaneMode, wordState, year }} />
          )}
        </CardGroup>
      </Row>
    </Container>
  )
}

export default SearchResults
