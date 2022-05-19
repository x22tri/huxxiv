import { useState, useCallback, Dispatch, SetStateAction } from 'react'

import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
// import Tab from 'react-bootstrap/Tab'
import Stack from 'react-bootstrap/Stack'

import { DataOptions, Keyword } from '../types'
import WordOverview from './WordOverview'
import PronunciationPane from './PronunciationPane'
import { notOutOfBounds, calculateOpacity } from '../utils/appearance-utils'
import {
  usePreventFlashOnMount,
  Flasher,
} from '../utils/usePreventFlashOnMount'
import useChangeYearOnScroll from '../utils/useChangeYearOnScroll'
import './SearchResults.css'

const startingYear = 2000

const SearchResults = ({
  wordState,
  setWordState,
}: {
  wordState: DataOptions[]
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
}) => {
  const preventFlashOnMount = usePreventFlashOnMount()

  // const [year, setYear] = useState(startingYear)
  const [cardHeight, setCardHeight] = useState(0)
  const [sidePaneMode, setSidePaneMode] = useState<
    'meaning' | 'pronunciation' | 'inflection'
  >('meaning')

  let year = useChangeYearOnScroll()

  // This state provides an immutable starting point for all phonetic etc. processes.
  const [initialState] = useState(wordState)

  // This is used to make sure '2000' is displayed at the middle of the card.
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setCardHeight(node.getBoundingClientRect().height)
  }, [])

  const keywordList: Keyword[] = wordState.flatMap(wordObject =>
    'word' in wordObject && notOutOfBounds(wordObject, year) ? wordObject : []
  )

  return (
    <Container fluid id='word-overview-container'>
      <p id='scroll-down-prompter'>
        ↓ Görgess lefelé a szó fejlődésének megtekintéséhez ↓
      </p>
      {cardHeight ? (
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
      ) : null}
      <Row id='fixed-row'>
        {/* <CardGroup id='search-results-card-group'>
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
        </CardGroup> */}
        <Card id='search-results-card'>
          <Card.Title as='h3' className='px-3 pt-3'>
            {keywordList.map((wordObject, index) => (
              <Flasher key={wordObject.word} {...{ preventFlashOnMount }}>
                <span
                  className='flash'
                  style={{
                    color: `rgba(0, 0, 0, ${calculateOpacity(
                      wordObject,
                      year
                    )}`,
                  }}
                >
                  {index > 0 && ' / '}
                  {wordObject.word}
                </span>
              </Flasher>
            ))}
          </Card.Title>
          <Nav
            defaultActiveKey='meaning'
            fill
            justify
            // id='tabs'
            onSelect={selectedKey => {
              if (
                selectedKey === 'meaning' ||
                selectedKey === 'pronunciation' ||
                selectedKey === 'inflection'
              )
                setSidePaneMode(selectedKey)
            }}
          >
            <Nav.Link eventKey='meaning'>JELENTÉS</Nav.Link>
            <Nav.Link eventKey='pronunciation'>KIEJTÉS</Nav.Link>
            <Nav.Link eventKey='inflection'>RAGOZÁS</Nav.Link>
          </Nav>
          {sidePaneMode === 'meaning' && (
            <WordOverview
              {...{
                measuredRef,
                sidePaneMode,
                setSidePaneMode,
                wordState,
                setWordState,
                initialState,
                // year,
                // setYear,
                startingYear,
              }}
            />
          )}
          {sidePaneMode === 'pronunciation' && (
            <PronunciationPane {...{ initialState, wordState, setWordState }} />
          )}
        </Card>
      </Row>
    </Container>
  )
}

export default SearchResults
