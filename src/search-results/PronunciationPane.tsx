import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import { getMainPronunciation } from '../utils/getPronunciation'
import { calculateOpacity } from '../utils/appearance-utils'
import { DataOptions, Keyword } from '../types'

const PronunciationPane = ({
  wordState,
  year,
}: {
  wordState: DataOptions[]
  year: number
}) => {
  let word = wordState.find(wordObject => 'word' in wordObject) as Keyword

  console.log(word.concurrentPronunciations)

  if (!word) return null
  else
    return (
      <Card>
        <Card.Title as='h6' className='px-3 pt-3'>
          Elsődleges kiejtés ebben a korszakban:
        </Card.Title>
        <Card.Subtitle className='px-3 pt-2 pb-3 fs-5'>
          {word.concurrentPronunciations &&
            `[${getMainPronunciation(word.concurrentPronunciations)}]`}
        </Card.Subtitle>
        {!!word.activeRules?.length && (
          <Card.Body className='px-3 pt-1'>
            Variációk:
            <ListGroup as='ul' variant='flush' className='px-3'>
              {word.activeRules.map(rule => (
                <ListGroup.Item
                  as='li'
                  className='fs-5 flash py-1 ps-0'
                  key={`${rule.target} ~ ${rule.change}`}
                  style={{
                    color: `rgba(0, 0, 0, ${calculateOpacity(rule, year)}`,
                  }}
                >
                  {`• ${rule.target} ~ ${rule.change}`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        )}
      </Card>
    )
}

export default PronunciationPane
