import { useState, useCallback, Dispatch, SetStateAction } from 'react'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'

import { DataOptions } from '../types'
import WordOverview from './WordOverview'
import './SearchResults.css'

const SearchResults = ({
  wordState,
  setWordState,
}: {
  wordState: DataOptions[]
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
}) => {
  const [cardHeight, setCardHeight] = useState(0)
  const [sidePaneMode, setSidePaneMode] = useState<
    null | 'pronunciation' | 'inflection'
  >(null)

  // This state provides an immutable starting point for all phonetic etc. processes.
  const [initialState] = useState(wordState)

  // This is used to make sure '2000' is displayed at the middle of the card.
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    node && setCardHeight(node.getBoundingClientRect().height)
  }, [])

  return (
    <Container fluid className='word-overview-container'>
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
              </div>
            )
          )}
        </Stack>
      )}
      <Row className='fixed-row'>
        <Col xs={0} md={2} lg={3} />
        <Col xs={12} md={8} lg={6}>
          <WordOverview
            {...{
              measuredRef,
              sidePaneMode,
              setSidePaneMode,
              wordState,
              setWordState,
              initialState,
            }}
          />
        </Col>
        {sidePaneMode && (
          <Col xs={0} md={0} lg={3}>
            <Card>test</Card>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default SearchResults
