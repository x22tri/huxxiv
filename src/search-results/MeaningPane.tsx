import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import { WordUse } from '../types'
import { calculateOpacity } from '../utils/appearance-utils'
import { useNoFlashOnMount, Flasher } from '../utils/useNoFlashOnMount'

import './MeaningPane.css'

const MeaningPane = ({
  measuredRef,
  useList,
  year,
}: {
  measuredRef: (node: HTMLDivElement | null) => void
  useList: WordUse[]
  year: number
}) => {
  const preventFlashOnMount = useNoFlashOnMount()

  // 2010: main: kɒpcsos +1 -> ɒ ~ ɑ (kɑpcsos)
  // 2051: main: kɑpcsos +1 -> ɑ ~ ɒ (kɒpcsos)
  // 2060: main: kɑpcsos + 2 -> ɑ ~ ɒ (kɒpcsos), ɑ ~ ä (käpcsos)
  // 2081: main: kɑpcsos + 1 -> ɑ ~ ä (käpcsos)

  // The main return on the MeaningPane component.
  return (
    <div ref={measuredRef} id='word-overview-card'>
      <Card.Body className='p-0'>
        <ListGroup as='ol' variant='flush' numbered>
          {useList.map(wordObject => (
            <Flasher key={wordObject.meaning} {...{ preventFlashOnMount }}>
              <ListGroup.Item
                as='li'
                className='fs-5 p-3 d-flex align-items-start flash'
                style={{
                  color: `rgba(0, 0, 0, ${calculateOpacity(wordObject, year)}`,
                }}
              >
                <div className='d-flex flex-column w-100 justify-content-between ms-2'>
                  <div className='d-flex justify-content-between'>
                    {wordObject.meaning}
                  </div>
                  <div>
                    {wordObject.examples &&
                      wordObject.examples.map((example, index) => (
                        <div
                          className='fs-6'
                          key={index}
                          style={{
                            color: `rgba(108, 117, 125, ${calculateOpacity(
                              wordObject,
                              year
                            )}`,
                          }}
                        >
                          {example}
                        </div>
                      ))}
                  </div>
                </div>
              </ListGroup.Item>
            </Flasher>
          ))}
        </ListGroup>
      </Card.Body>
    </div>
  )
}

export default MeaningPane
