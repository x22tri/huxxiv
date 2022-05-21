import { Dispatch, SetStateAction } from 'react'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

import {
  getMainPronunciation,
  getNumberOfVariants,
} from '../utils/getPronunciation'
import { calculateOpacity } from '../utils/appearance-utils'
import { useNoFlashOnMount, Flasher } from '../utils/useNoFlashOnMount'
import { useUpdateCharBasedOnYear } from '../utils/useUpdateCharBasedOnYear'
import {
  ConcurrentPronunciation,
  DataOptions,
  Keyword,
  PhoneticInfo,
} from '../types'

const PronunciationPane = ({
  wordState,
  year,
}: {
  wordState: DataOptions[]
  year: number
}) => {
  const preventFlashOnMount = useNoFlashOnMount()
  const word = wordState.find(wordObject => 'word' in wordObject) as Keyword

  if (!word || !word.concurrentPronunciations) return null
  else {
    const variants = word.concurrentPronunciations
      .map(c => c.variants.map(variant => ({ ...variant, main: c.main })))
      .filter(e => !!e.length)
      .flat()

    const ruleDisplay = (
      main: string,
      newPron: string | undefined,
      oldPron: string | undefined
    ) => (newPron ? `[${main}] ~ [${newPron}]` : `[${main}] ~ [${oldPron}]`)

    return (
      <div>
        <Card.Title as='h6' className='px-3 pt-3'>
          {`${
            !!getNumberOfVariants(word.concurrentPronunciations)
              ? 'Elsődleges kiejtése'
              : 'Kiejtése'
          } ebben a korszakban:`}
        </Card.Title>
        <Card.Subtitle className='px-3 pt-2 pb-3 fs-5 d-flex justify-content-center'>
          {word.concurrentPronunciations &&
            `[${getMainPronunciation(word.concurrentPronunciations)}]`}
        </Card.Subtitle>
        {!!getNumberOfVariants(word.concurrentPronunciations) && (
          <Card.Body className='px-3 pt-1'>
            Változatok:
            <ListGroup as='ul' variant='flush' className='ps-3'>
              {variants.map(element => (
                <Flasher key={element.id} {...{ preventFlashOnMount }}>
                  <Row
                    as='li'
                    className='fs-5 flash py-1 ps-0'
                    style={{
                      color: `rgba(0, 0, 0, ${calculateOpacity(element, year)}`,
                    }}
                  >
                    <Col xs='auto' className='px-0'>
                      {`• ${ruleDisplay(
                        element.main,
                        element.new,
                        element.old
                      )}`}
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
