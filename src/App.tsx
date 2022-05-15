import { useState, Dispatch, SetStateAction } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Search } from 'react-bootstrap-icons'

import { CHARS } from './database/CHARSV2'
import { ErrorMessage, DataOptions } from './types'
import SearchResults from './search-results/SearchResults'
import AppNavbar from './navbar/AppNavbar'
import logo from './assets/hun2500logo.png'
import './App.css'

const WordSearcher = ({
  searchTerm,
  setSearchTerm,
  setSearchResult,
  navbarView = false,
}: {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  setSearchResult: Dispatch<
    SetStateAction<DataOptions[] | ErrorMessage | undefined>
  >
  navbarView?: boolean
}) => {
  const findWord = (word: string): void => {
    setSearchResult(
      CHARS.find(el => el.data.find(d => 'word' in d && d.word === word))
        ?.data ?? 'A szó nem található az adatbázisban.'
    )
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

const isErrorMessage = (
  searchResult: DataOptions[] | ErrorMessage
): searchResult is ErrorMessage => {
  return typeof (searchResult as ErrorMessage) === 'string'
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState<
    DataOptions[] | ErrorMessage | undefined
  >()

  return (
    <div className='App'>
      {!searchResult ? (
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
          <WordSearcher {...{ searchTerm, setSearchTerm, setSearchResult }} />
        </Container>
      ) : (
        <>
          <AppNavbar
            wordSearcher={
              <WordSearcher
                navbarView
                {...{ searchTerm, setSearchTerm, setSearchResult }}
              />
            }
          />
          {isErrorMessage(searchResult) ? (
            <div className='error-field d-flex my-auto'>{searchResult}</div>
          ) : (
            <SearchResults
              wordState={searchResult}
              setWordState={
                setSearchResult as Dispatch<SetStateAction<DataOptions[]>>
              }
            />
          )}
        </>
      )}
    </div>
  )
}

export type { ErrorMessage }
export default App
