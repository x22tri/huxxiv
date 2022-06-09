import ReactMarkdown from 'react-markdown'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

import { getNumberOfVariants } from '../utils/getPronunciation'
import { useNoFlashOnMount, Flasher } from '../utils/useNoFlashOnMount'
import { calculateOpacity } from '../utils/appearance-utils'
import { PronunciationChange } from '../types'

const PronunciationPane = ({
  activeSoundChanges,
  mainPronunciation,
  year,
}: {
  activeSoundChanges: PronunciationChange[][] | undefined
  mainPronunciation: string | undefined
  year: number
}) => {
  const preventFlashOnMount = useNoFlashOnMount()

  return !mainPronunciation || !activeSoundChanges ? null : (
    <>
      <Card.Title as='h6' className='px-3 pt-3'>
        {`${
          !!getNumberOfVariants(activeSoundChanges, year)
            ? 'Elsődleges kiejtése'
            : 'Kiejtése'
        } ebben a korszakban:`}
      </Card.Title>
      <Card.Subtitle className='px-3 pt-2 pb-3 fs-5 d-flex justify-content-center'>
        {`[${mainPronunciation}]`}
      </Card.Subtitle>
      {!!getNumberOfVariants(activeSoundChanges, year) && (
        <Card.Body className='px-3 pt-1'>
          Változatok:
          <ListGroup as='ul' variant='flush' className='ps-3'>
            {activeSoundChanges.map((soundChange, index) =>
              soundChange.length <= 1 ? null : (
                <Flasher key={index} {...{ preventFlashOnMount }}>
                  <Row as='li' className='fs-5 flash py-1 ps-0'>
                    <Col xs={2} className=''>
                      •&nbsp;
                      {soundChange.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            color: `rgba(0, 0, 0, ${calculateOpacity(c, year)}`,
                          }}
                        >
                          {i !== 0 && ' > '}
                          {c.sound}
                        </span>
                      ))}
                    </Col>
                    <Col className='pt-2' style={{ fontSize: '70%' }}>
                      <ReactMarkdown>
                        {soundChange
                          .slice()
                          .reverse()
                          .find(s => s.note)?.note || ''}
                      </ReactMarkdown>
                    </Col>
                  </Row>
                </Flasher>
              )
            )}
          </ListGroup>
        </Card.Body>
      )}
    </>
  )
}

export default PronunciationPane
