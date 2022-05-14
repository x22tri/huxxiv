import { useState, useCallback, createContext, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'

import { DataOptions, Word } from '../types'
import { ErrorMessage } from '../App'
import WordOverview from './WordOverview'
import convertCharToState from '../utils/convertCharToState'
import './SearchResults.css'

const ErrorField = ({ error }: { error: ErrorMessage }) => {
  return <div className='error-field d-flex my-auto'>{error}</div>
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
  const [cardHeight, setCardHeight] = useState(0)
  const [sidePaneMode, setSidePaneMode] = useState<
    null | 'pronunciation' | 'inflection'
  >(null)

  const [wordState, setWordState] = useState<undefined | DataOptions[]>()

  // const WordContext = createContext({})

  // This is used to make sure '2000' is displayed at the middle of the card.
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) setCardHeight(node.getBoundingClientRect().height)
  }, [])

  useEffect(() => {
    if (!isErrorMessage(searchResult)) {
      setWordState(convertCharToState(searchResult))
    }
  }, [searchResult])

  if (isErrorMessage(searchResult)) return <ErrorField error={searchResult} />
  else if (!wordState) return <div>Betöltés...</div>
  else {
    console.log(wordState)
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
        {/* <WordContext.Provider> */}
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
              }}
            />
          </Col>
          {sidePaneMode && (
            <Col xs={0} md={0} lg={3}>
              <Card>test</Card>
            </Col>
          )}
        </Row>
        {/* </WordContext.Provider> */}
      </Container>
    )
  }
}

export default SearchResults
