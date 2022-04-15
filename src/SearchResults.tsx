import { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Stack from 'react-bootstrap/Stack'
import Row from 'react-bootstrap/Row'

import { Word } from './CHARS'
import { ErrorMessage } from './App'
import './SearchResults.css'

const ErrorField = ({ error }: { error: ErrorMessage }) => {
  return <div className='error-field d-flex my-auto'>{error}</div>
}

const WordOverview = ({ word }: { word: Word }) => {
  const [currentYear, setCurrentYear] = useState(2000)
  const handleScroll = () => {
    setCurrentYear(2000 + Math.floor(window.scrollY / 10))
  }

  console.log(currentYear)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Container className='mt-4'>
      {/* <Row> */}
      {/* <Col xs={2}> */}
      {/* <Stack gap={5}>
            {[2000, 2050, 2100, 2150, 2200].map((element) => (
              <div key={element} className='year'>
                {element}
              </div>
            ))}
          </Stack> */}
      {/* </Col> */}
      {/* <Col xs={8}> */}
      <Card
        className='word-overview-card'
        style={{
          position: 'fixed',
        }}
      >
        <Card.Body>
          <Card.Title as='h3'>{word.word}</Card.Title>
          <Card.Subtitle className='mb-2 text-muted'>
            {word.partOfSpeech}
          </Card.Subtitle>
          <ListGroup as='ol' variant='flush' numbered>
            {word.use.map((element) => (
              <ListGroup.Item as='li' className='fs-5' key={element.useId}>
                {element.meaning}
                {element.examples &&
                  element.examples.map((example, index) => (
                    <div className='text-muted fs-6' key={index}>
                      {example}
                    </div>
                  ))}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
      {/* </Col> */}
      {/* <Col xs={2} /> */}
      {/* </Row> */}
    </Container>
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
  return isErrorMessage(searchResult) ? (
    <ErrorField error={searchResult} />
  ) : (
    <div className='word-overview-container'>
      <WordOverview word={searchResult} />
    </div>
  )
}

export default SearchResults
