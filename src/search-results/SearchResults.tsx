import React, {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  FunctionComponent,
  ComponentClass,
} from 'react'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import Stack from 'react-bootstrap/Stack'
import {
  Ear,
  Pencil,
  ChatLeftDots,
  EarFill,
  PencilFill,
  ChatLeftDotsFill,
} from 'react-bootstrap-icons'

import { DataOptions, Keyword, WordUse } from '../types'
import MeaningPane from './MeaningPane'
import PronunciationPane from './PronunciationPane'
import { notOutOfBounds, calculateOpacity } from '../utils/appearance-utils'
import { useNoFlashOnMount, Flasher } from '../utils/useNoFlashOnMount'
import { useUpdateCharBasedOnYear } from '../utils/useUpdateCharBasedOnYear'
import {
  getMainPronunciation,
  getNumberOfVariants,
} from '../utils/getPronunciation'
import './SearchResults.css'

const NavIcon = ({
  eventKey,
  passiveIcon,
  activeIcon,
  sidePaneMode,
  activeTitle,
  notActiveTitle,
}: {
  eventKey: string
  passiveIcon: ComponentClass | FunctionComponent<any>
  activeIcon: ComponentClass | FunctionComponent<any>
  sidePaneMode: string
  activeTitle: string
  notActiveTitle: string | JSX.Element[]
}) => {
  const active = !!(sidePaneMode === eventKey)
  const [hovered, setHovered] = useState(false)
  const passiveColor = '#8182ae'
  const hoverColor = '#bbbce0'
  const icon = active ? activeIcon : passiveIcon

  return (
    <Nav.Link
      {...{ eventKey }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {React.createElement(icon, {
        color: active ? 'white' : hovered ? hoverColor : passiveColor,
      })}
      <div
        style={{
          color: active ? 'white' : hovered ? hoverColor : passiveColor,
          textDecorationLine: active ? 'underline' : undefined,
          textDecorationThickness: '1.5px',
          textUnderlineOffset: '4px',
          marginTop: '2px',
        }}
      >
        {active || hovered ? activeTitle : notActiveTitle}
      </div>
    </Nav.Link>
  )
}

const SearchResults = ({
  wordState,
  setWordState,
}: {
  wordState: DataOptions[]
  setWordState: Dispatch<SetStateAction<DataOptions[]>>
}) => {
  const preventFlashOnMount = useNoFlashOnMount()

  const [cardHeight, setCardHeight] = useState(0)
  const [sidePaneMode, setSidePaneMode] = useState<
    'meaning' | 'pronunciation' | 'inflection'
  >('meaning')

  // This state provides an immutable starting point for all phonetic etc. processes.
  const [initialState] = useState(wordState)

  let year = useUpdateCharBasedOnYear(initialState, setWordState)

  // This is used to make sure the first year, '2000', is displayed at the middle of the card.
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setCardHeight(node.getBoundingClientRect().height)
  }, [])

  // A list of type guards.
  // TypeScript doesn't seem to allow the type guard with the regular "filter" function.
  const keywordList: Keyword[] = wordState.flatMap(wordObject =>
    'word' in wordObject && notOutOfBounds(wordObject, year) ? wordObject : []
  )

  const useList: WordUse[] = wordState.flatMap(wordObject =>
    'meaning' in wordObject && notOutOfBounds(wordObject, year)
      ? wordObject
      : []
  )

  return (
    <Container fluid id='word-overview-container'>
      <p id='scroll-down-prompter'>
        ↓ Görgess lefelé a szó fejlődésének megtekintéséhez ↓
      </p>
      {!!cardHeight && (
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
      <Row id='fixed-row'>
        <Card id='search-results-card' className='px-0'>
          <Card.Header className='p-0' id='search-results-card-header'>
            <Card.Title
              as='h3'
              id='keyword'
              className='pt-2 pb-2 mb-0 fw-bold d-flex justify-content-center'
            >
              {keywordList.map((wordObject, index) => (
                <Flasher key={wordObject.word} {...{ preventFlashOnMount }}>
                  <span
                    className='flash'
                    style={{
                      color: `rgba(255, 255, 255, ${calculateOpacity(
                        wordObject,
                        year
                      )}`,
                    }}
                  >
                    {index > 0 && '/'}
                    {wordObject.word}
                  </span>
                </Flasher>
              ))}
            </Card.Title>
            <hr />
            <Nav
              defaultActiveKey='meaning'
              fill
              justify
              id='tabs'
              onSelect={selectedKey => {
                if (
                  selectedKey === 'meaning' ||
                  selectedKey === 'pronunciation' ||
                  selectedKey === 'inflection'
                )
                  setSidePaneMode(selectedKey)
              }}
            >
              <NavIcon
                eventKey='meaning'
                passiveIcon={ChatLeftDots}
                activeIcon={ChatLeftDotsFill}
                activeTitle='JELENTÉS'
                notActiveTitle={`${useList.length} definíció`}
                {...{ sidePaneMode }}
              />

              <NavIcon
                eventKey='pronunciation'
                passiveIcon={Ear}
                activeIcon={EarFill}
                activeTitle='KIEJTÉS'
                notActiveTitle={keywordList.map((wordObject, index) => {
                  const pron = wordObject.concurrentPronunciations
                  return pron ? (
                    <div key={index}>
                      {index > 0 && <span style={{ margin: '0 5px' }}>/</span>}
                      <span>{`[${getMainPronunciation(pron)}]`}</span>
                      {!!getNumberOfVariants(pron) && (
                        <span className='number-of-variants'>
                          {`(+${getNumberOfVariants(pron)})`}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span key={index} />
                  )
                })}
                {...{ sidePaneMode }}
              />
              <NavIcon
                eventKey='inflection'
                passiveIcon={Pencil}
                activeIcon={PencilFill}
                activeTitle='RAGOZÁS'
                notActiveTitle={wordState.map((wordObject, index) =>
                  'partOfSpeech' in wordObject ? (
                    <span key={wordObject.partOfSpeech}>
                      {wordObject.partOfSpeech}
                    </span>
                  ) : (
                    <span key={index} />
                  )
                )}
                {...{ sidePaneMode }}
              />
            </Nav>
          </Card.Header>
          {sidePaneMode === 'meaning' && (
            <MeaningPane
              {...{
                measuredRef,
                useList,
                year,
              }}
            />
          )}

          {sidePaneMode === 'pronunciation' && (
            <PronunciationPane {...{ wordState, year }} />
          )}
        </Card>
      </Row>
    </Container>
  )
}

export default SearchResults
