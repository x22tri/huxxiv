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
  Inflection,
  Keyword,
  PhoneticInfo,
  WordUse,
} from '../types'
import { calculateOpacity } from '../utils/appearance-utils'
import { Flasher } from '../utils/useNoFlashOnMount'
import {
  getMainPronunciation,
  getNumberOfVariants,
} from '../utils/getPronunciation'

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
  pronunciations,
}: {
  pronunciations: PhoneticInfo[] | undefined
}) =>
  !!pronunciations ? (
    <div>
      <span>{`[${getMainPronunciation(pronunciations)}]`}</span>
      {!!getNumberOfVariants(pronunciations) && (
        <span id='number-of-variants'>
          {`(+${getNumberOfVariants(pronunciations)})`}
        </span>
      )}
    </div>
  ) : (
    <span />
  )

const PartOfSpeechOverview = ({
  inflection,
}: {
  inflection: Inflection | undefined
}) => (inflection ? <span>{inflection.partOfSpeech}</span> : <span />)

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
  mainKeyword,
  preventFlashOnMount,
  year,
}: {
  mainKeyword: Keyword
  preventFlashOnMount: number
  year: number
}) => (
  <Card.Title
    as='h3'
    id='keyword'
    className='pt-2 pb-2 mb-0 fw-bold d-flex justify-content-center'
  >
    <Flasher key={mainKeyword.word} {...{ preventFlashOnMount }}>
      <span
        className='flash'
        style={{
          color: `rgba(255, 255, 255, ${calculateOpacity(mainKeyword, year)}`,
        }}
      >
        {mainKeyword.word}
      </span>
    </Flasher>
  </Card.Title>
)

const TabNavigation = ({
  activePane,
  mainKeyword,
  inflection,
  setActivePane,
  useList,
}: {
  activePane: ActivePane
  mainKeyword: Keyword
  inflection: Inflection
  setActivePane: Dispatch<SetStateAction<ActivePane>>
  useList: WordUse[]
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
          pronunciations={mainKeyword.concurrentPronunciations}
        />
      }
      {...{ activePane }}
    />
    <NavIcon
      eventKey='inflection'
      passiveIcon={Pencil}
      activeIcon={PencilFill}
      activeTitle='RAGOZÁS'
      notActiveTitle={<PartOfSpeechOverview {...{ inflection }} />}
      {...{ activePane }}
    />
  </Nav>
)

export { KeywordRow, YearsBG, TabNavigation }
