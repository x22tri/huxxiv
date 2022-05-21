import { Dispatch, SetStateAction } from 'react'
import ReactMarkdown from 'react-markdown'

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
      .map(c => {
        let newProns = c.variants.filter(variant => variant.new)
        let oldProns = c.variants.filter(variant => variant.old)

        return !!(newProns.length || oldProns.length)
          ? {
              main: c.main,
              new: newProns,
              old: oldProns,
              note:
                newProns.find(variant => variant.note)?.note ||
                oldProns.find(variant => variant.note)?.note,
            }
          : undefined
      })
      .filter(e => !!e)

    const ruleDisplay = (
      main?: string,
      newPron?: ConcurrentPronunciation[],
      oldPron?: ConcurrentPronunciation[]
    ) => (
      <>
        •&nbsp;
        {oldPron &&
          oldPron.map((p, index) => (
            <span
              key={index}
              style={{
                color: `rgba(0, 0, 0, ${calculateOpacity(p, year)}`,
              }}
            >
              {p.old}&nbsp;&gt;&nbsp;
            </span>
          ))}
        {main && <span>{main}</span>}
        {newPron &&
          newPron.map((p, index) => (
            <span
              key={index}
              style={{
                color: `rgba(0, 0, 0, ${calculateOpacity(p, year)}`,
              }}
            >
              &nbsp;&gt;&nbsp;{p.new}
            </span>
          ))}
      </>
    )

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
              {variants.map((element, index) => (
                <Flasher key={index} {...{ preventFlashOnMount }}>
                  <Row as='li' className='fs-5 flash py-1 ps-0'>
                    <Col xs={2} className=''>
                      {ruleDisplay(element?.main, element?.new, element?.old)}
                    </Col>
                    <Col className='pt-2' style={{ fontSize: '70%' }}>
                      {element?.note ? (
                        <ReactMarkdown>{element.note}</ReactMarkdown>
                      ) : null}
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
