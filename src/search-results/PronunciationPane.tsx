import { Dispatch, SetStateAction } from 'react'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

import { getMainPronunciation } from '../utils/getPronunciation'
import { calculateOpacity } from '../utils/appearance-utils'
import {
  usePreventFlashOnMount,
  Flasher,
} from '../utils/usePreventFlashOnMount'
import { useUpdateCharBasedOnYear } from '../utils/convertCharToState'
import { ConcurrentPronunciation, DataOptions, Keyword } from '../types'
import useChangeYearOnScroll from '../utils/useChangeYearOnScroll'

const PronunciationPane = ({
  // sidePaneMode,
  initialState,
  wordState,
  setWordState,
}: // year,
{
  // sidePaneMode: null | 'pronunciation' | 'inflection'
  wordState: DataOptions[]
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
  initialState: DataOptions[]
  // year: number
}) => {
  const preventFlashOnMount = usePreventFlashOnMount()

  const word = wordState.find(wordObject => 'word' in wordObject) as Keyword

  let year = useChangeYearOnScroll()
  useUpdateCharBasedOnYear(initialState, setWordState, year)

  if (!word || !word.concurrentPronunciations) return null
  else {
    const concurrent = word.concurrentPronunciations.filter(
      element => typeof element === 'object'
    ) as ConcurrentPronunciation[]

    console.log(year)

    const ruleDisplay = (concurrentElement: ConcurrentPronunciation) =>
      concurrentElement.new
        ? `[${concurrentElement.main}] ~ [${concurrentElement.new}]`
        : `[${concurrentElement.main}] ~ [${concurrentElement.old}]`

    return (
      <div>
        <Card.Title as='h6' className='px-3 pt-3'>
          Elsődleges kiejtés ebben a korszakban:
        </Card.Title>
        <Card.Subtitle className='px-3 pt-2 pb-3 fs-5'>
          {word.concurrentPronunciations &&
            `[${getMainPronunciation(word.concurrentPronunciations)}]`}
        </Card.Subtitle>
        {!!concurrent.length && (
          <Card.Body className='px-3 pt-1'>
            Változatok:
            <ListGroup as='ul' variant='flush' className='ps-3'>
              {concurrent.map(element => (
                <Flasher key={element.id} {...{ preventFlashOnMount }}>
                  <Row
                    as='li'
                    className='fs-5 flash py-1 ps-0'
                    style={{
                      color: `rgba(0, 0, 0, ${calculateOpacity(element, year)}`,
                    }}
                  >
                    <Col xs='auto' className='px-0'>
                      {`• ${ruleDisplay(element)}`}
                    </Col>
                    <Col className='pt-2' style={{ fontSize: '70%' }}>
                      {element.note || null}
                    </Col>
                  </Row>
                </Flasher>
              ))}
            </ListGroup>
          </Card.Body>
        )}
      </div>
    )
  }
}

export default PronunciationPane
