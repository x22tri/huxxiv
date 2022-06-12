/// <reference types="react-scripts" />

import { useState, Dispatch, SetStateAction } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Search } from 'react-bootstrap-icons'

import { WORDS } from './database/WORDS'
import { ActivePane, ErrorMessage, Word } from './types'
import SearchResults from './search-results/SearchResults'
import AppNavbar from './navbar/AppNavbar'
import logo from './assets/hun2500logo.png'
import './App.css'

const WordSearcher = ({
  searchTerm,
  setSearchTerm,
  setSearchResult,
  setInitialState,
  navbarView = false,
}: {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  setSearchResult: Dispatch<SetStateAction<Word | ErrorMessage | undefined>>
  setInitialState: Dispatch<SetStateAction<Word | undefined>>
  navbarView?: boolean
}) => {
  const findWord = (word: string): void => {
    let w = WORDS.find(entry => entry.word === word)
    setSearchResult(w ?? `A ${word} szó nem található az adatbázisban.`)
    setInitialState(w ?? undefined)
  }

  return (
    <Form
      className={`search-form ${!navbarView && 'mt-5'}`}
      onSubmit={event => {
        event.preventDefault()
        findWord(searchTerm)
      }}
    >
      {!navbarView && (
        <Form.Label className='mt-5'>
          Keress rá egy magyar szóra, hogy megtudd, hogyan fog változni a
          következő 400 évben!
        </Form.Label>
      )}
      <InputGroup>
        <Form.Control
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Button variant='primary' type='submit' id='search-button'>
          <Search className='d-flex' />
        </Button>
      </InputGroup>
      {!navbarView && (
        <Form.Text className='text-white-50'>
          A szót szótári alakban add meg. (Igéknél ez az E/3 alak.)
        </Form.Text>
      )}
    </Form>
  )
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState<
    Word | ErrorMessage | undefined
  >()

  // The active pane state needed to be lifted up here so it stays constant between rerenders.
  const [activePane, setActivePane] = useState<ActivePane>('meaning')

  // This state provides an immutable starting point for all phonetic etc. processes.
  const [initialState, setInitialState] = useState<Word | undefined>()

  return (
    <div className='App'>
      {!searchResult ? ( // Show main page before user looks up a word.
        <Container
          fluid
          className='d-flex flex-column align-items-center p-2'
          id='main-page-container'
        >
          <img src={logo} alt='Logó' height='120' className='mt-3' />
          <div className='mt-4 mb-0 fs-1 noselect' id='huxxiv-name'>
            HUXXIV
          </div>
          <div className='text-white-50 noselect' id='huxxiv-pinyin'>
            [ˈhukːsiv]
          </div>
          <WordSearcher
            {...{ searchTerm, setSearchTerm, setSearchResult, setInitialState }}
          />
        </Container>
      ) : (
        // Show navbar on top and word card / error below after user has looked up a word.
        <>
          <AppNavbar
            wordSearcher={
              <WordSearcher
                navbarView
                {...{
                  searchTerm,
                  setSearchTerm,
                  setSearchResult,
                  setInitialState,
                }}
              />
            }
          />
          {typeof searchResult === 'string' ? ( // Show error.
            <div className='error-field d-flex my-auto'>{searchResult}</div>
          ) : (
            <SearchResults // Show search result card.
              key={JSON.stringify(searchResult)}
              wordState={searchResult}
              setWordState={setSearchResult as Dispatch<SetStateAction<Word>>}
              initialState={initialState as Word}
              {...{ activePane, setActivePane }}
            />
          )}
        </>
      )}
    </div>
  )
}

export type { ErrorMessage }
export { App, SearchResults }
