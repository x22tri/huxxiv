import { useState, Dispatch, SetStateAction } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'
import { Search } from 'react-bootstrap-icons'

import { Word, CHARS } from './CHARS'
import SearchResults from './SearchResults'
import AppNavbar from './AppNavbar'
import logo from './assets/hun2500logo.png'
import './App.css'

type ErrorMessage = string

const WordSearcher = ({
  searchTerm,
  setSearchTerm,
  setSearchResult,
  navbarView = false,
}: {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  setSearchResult: Dispatch<SetStateAction<Word | ErrorMessage | undefined>>
  navbarView?: boolean
}) => {
  const findWord = (word: string): void => {
    let foundWord = CHARS.find((element) => element.word === word)
    foundWord
      ? setSearchResult(foundWord)
      : setSearchResult('A szó nem található az adatbázisban.')
  }

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        findWord(searchTerm)
      }}
    >
      {!navbarView && (
        <Form.Label>
          Keress rá egy magyar szóra, hogy megtudd, hogyan fog változni a
          következő 500 évben!
        </Form.Label>
      )}
      <InputGroup>
        <Form.Control
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant='primary' type='submit' id='search-button'>
          <Search className='d-flex' />
        </Button>
      </InputGroup>
      {!navbarView && (
        <Form.Text className='text-muted'>
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

  return (
    <div className='App'>
      {!searchResult ? (
        <WordSearcher {...{ searchTerm, setSearchTerm, setSearchResult }} />
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
          <SearchResults {...{ searchResult }} />
        </>
      )}
    </div>
  )
}

export type { ErrorMessage }
export default App
