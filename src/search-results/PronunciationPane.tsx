import ReactMarkdown from 'react-markdown'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

import ChangingPronunciation from './ChangingPronunciation'

import {
  getMainPronunciation,
  getNumberOfVariants,
} from '../utils/getPronunciation'
import { useNoFlashOnMount, Flasher } from '../utils/useNoFlashOnMount'
import { PhoneticInfo } from '../types'

const PronunciationPane = ({
  pron,
  year,
}: {
  pron: PhoneticInfo[] | undefined
  year: number
}) => {
  const preventFlashOnMount = useNoFlashOnMount()

  if (!pron) throw new Error('A szó kiejtése nem található.')
  else {
    const variants = pron
      .map(c => {
        let newProns = c.variants.filter(n => n.new)
        let oldProns = c.variants.filter(o => o.old)

        return !!(newProns.length || oldProns.length)
          ? {
              main: {
                main: c.main,
                disappears: newProns.find(n => n.disappears)?.disappears,
              },
              new: newProns.map(n => ({ ...n, disappears: undefined })), // taking "disappears" out because of calculateOpacity
              old: oldProns.map(o => ({ ...o, appears: undefined })), // same
              note:
                newProns.find(n => n.note)?.note ||
                oldProns.find(o => o.note)?.note,
            }
          : undefined
      })
      .filter(e => !!e)

    return (
      <div>
        <Card.Title as='h6' className='px-3 pt-3'>
          {`${
            !!getNumberOfVariants(pron) ? 'Elsődleges kiejtése' : 'Kiejtése'
          } ebben a korszakban:`}
        </Card.Title>
        <Card.Subtitle className='px-3 pt-2 pb-3 fs-5 d-flex justify-content-center'>
          {pron && `[${getMainPronunciation(pron)}]`}
        </Card.Subtitle>
        {!!getNumberOfVariants(pron) && (
          <Card.Body className='px-3 pt-1'>
            Változatok:
            <ListGroup as='ul' variant='flush' className='ps-3'>
              {variants.map((element, index) => (
                <Flasher key={index} {...{ preventFlashOnMount }}>
                  <Row as='li' className='fs-5 flash py-1 ps-0'>
                    <Col xs={2} className=''>
                      <ChangingPronunciation
                        main={element?.main}
                        newPron={element?.new}
                        oldPron={element?.old}
                        {...{ year }}
                      />
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
