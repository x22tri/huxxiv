import {
  ComponentClass,
  createElement,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from 'react'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Stack from 'react-bootstrap/Stack'
import {
  ChatLeftDots,
  ChatLeftDotsFill,
  Ear,
  EarFill,
  Pencil,
  PencilFill,
} from 'react-bootstrap-icons'
import {
  ActivePane,
  PartOfSpeech,
  PronunciationChange,
  WordUse,
} from '../types'
import { Flasher } from '../utils/useNoFlashOnMount'
import { getNumberOfVariants } from '../utils/getPronunciation'

import './SearchResults.css'

const NavIcon = ({
  eventKey,
  passiveIcon,
  activeIcon,
  activePane,
  activeTitle,
  notActiveTitle,
}: {
  eventKey: string
  passiveIcon: ComponentClass | FunctionComponent<any>
  activeIcon: ComponentClass | FunctionComponent<any>
  activePane: string
  activeTitle: string
  notActiveTitle: string | JSX.Element | JSX.Element[]
}) => {
  const active = !!(activePane === eventKey)
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
      {createElement(icon, {
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

const PronunciationOverview = ({
  activeSoundChanges,
  mainPronunciation,
  year,
}: {
  activeSoundChanges: PronunciationChange[][] | undefined
  mainPronunciation: string | undefined
  year: number
}) =>
  !!mainPronunciation ? (
    <div>
      <span>[{mainPronunciation}]</span>
      {!!activeSoundChanges?.length &&
        !!getNumberOfVariants(activeSoundChanges, year) && (
          <span id='number-of-variants'>
            {`(+${getNumberOfVariants(activeSoundChanges, year)})`}
          </span>
        )}
    </div>
  ) : (
    <span />
  )

const PartOfSpeechOverview = ({
  partOfSpeech,
}: {
  partOfSpeech: PartOfSpeech | undefined
}) => <span>{partOfSpeech || ''}</span>

const YearsBG = ({ cardHeight }: { cardHeight: number | undefined }) =>
  !!cardHeight ? (
    <Stack
      style={{ marginTop: cardHeight / 2, float: 'left' }}
      className='px-5 w-100'
    >
      {[2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400].map(element => (
        <div key={element} className='year'>
          {element}
          <hr />
        </div>
      ))}
    </Stack>
  ) : null

const KeywordRow = ({
  word,
  preventFlashOnMount,
  year,
}: {
  word: string
  preventFlashOnMount: number
  year: number
}) => (
  <Card.Title
    as='h3'
    id='keyword'
    className='pt-2 pb-2 mb-0 fw-bold d-flex justify-content-center'
  >
    <Flasher key={word} {...{ preventFlashOnMount }}>
      <span className='flash text-white'>{word}</span>
    </Flasher>
  </Card.Title>
)

const TabNavigation = ({
  activePane,
  activeSoundChanges,
  mainPronunciation,
  word,
  partOfSpeech,
  setActivePane,
  useList,
  year,
}: {
  activePane: ActivePane
  activeSoundChanges: PronunciationChange[][] | undefined
  mainPronunciation: string | undefined
  word: string
  partOfSpeech: PartOfSpeech
  setActivePane: Dispatch<SetStateAction<ActivePane>>
  useList: WordUse[]
  year: number
}) => (
  <Nav
    defaultActiveKey={activePane}
    fill
    justify
    id='tabs'
    onSelect={selectedKey => setActivePane(selectedKey as ActivePane)}
  >
    <NavIcon
      eventKey='meaning'
      passiveIcon={ChatLeftDots}
      activeIcon={ChatLeftDotsFill}
      activeTitle='JELENTÉS'
      notActiveTitle={`${useList.length} definíció`}
      {...{ activePane }}
    />
    <NavIcon
      eventKey='pronunciation'
      passiveIcon={Ear}
      activeIcon={EarFill}
      activeTitle='KIEJTÉS'
      notActiveTitle={
        <PronunciationOverview
          activeSoundChanges={activeSoundChanges}
          mainPronunciation={mainPronunciation}
          {...{ year }}
          // pronunciations={word.concurrentPronunciations}
        />
      }
      {...{ activePane }}
    />
    <NavIcon
      eventKey='inflection'
      passiveIcon={Pencil}
      activeIcon={PencilFill}
      activeTitle='RAGOZÁS'
      notActiveTitle={<PartOfSpeechOverview {...{ partOfSpeech }} />}
      {...{ activePane }}
    />
  </Nav>
)

export { KeywordRow, YearsBG, TabNavigation }
