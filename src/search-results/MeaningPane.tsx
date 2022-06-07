import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import { WordUse } from '../types'
import { calculateOpacity } from '../utils/appearance-utils'
import { useNoFlashOnMount, Flasher } from '../utils/useNoFlashOnMount'

const MeaningPane = ({
  useList,
  year,
}: {
  useList: WordUse[]
  year: number
}) => {
  const preventFlashOnMount = useNoFlashOnMount()

  // The main return on the MeaningPane component.
  return (
    <>
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
    </>
  )
}

export default MeaningPane
