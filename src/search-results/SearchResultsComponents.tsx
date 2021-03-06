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
  notActiveTitle: string | JSX.Element
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
}: {
  word: string
  preventFlashOnMount: number
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
  partOfSpeech,
  setActivePane,
  useList,
  year,
}: {
  activePane: ActivePane
  activeSoundChanges: PronunciationChange[][] | undefined
  mainPronunciation: string | undefined
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
      activeTitle='JELENT??S'
      notActiveTitle={`${useList.length} defin??ci??`}
      {...{ activePane }}
    />
    <NavIcon
      eventKey='pronunciation'
      passiveIcon={Ear}
      activeIcon={EarFill}
      activeTitle='KIEJT??S'
      notActiveTitle={
        <PronunciationOverview
          {...{ activeSoundChanges, mainPronunciation, year }}
        />
      }
      {...{ activePane }}
    />
    <NavIcon
      eventKey='inflection'
      passiveIcon={Pencil}
      activeIcon={PencilFill}
      activeTitle='RAGOZ??S'
      notActiveTitle={<PartOfSpeechOverview {...{ partOfSpeech }} />}
      {...{ activePane }}
    />
  </Nav>
)

export { KeywordRow, YearsBG, TabNavigation }
