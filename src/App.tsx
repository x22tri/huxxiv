import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import CHARS from './CHARS'
import './App.css'

import { Search } from 'react-bootstrap-icons'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const findWord = (word: string): void => {
    let foundWord = CHARS.find((element) => element.word === word)
    if (foundWord) {
      console.log(foundWord)
    } else {
      console.log('A szó nem található.')
    }
  }

  return (
    <div className='App'>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          findWord(searchTerm)
        }}
      >
        <Form.Label>
          Keress rá egy magyar szóra, hogy megtudd, hogyan fog változni a
          következő 500 évben!
        </Form.Label>
        <InputGroup>
          <Form.Control
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant='primary' type='submit' id='search-button'>
            <Search className='search-icon' />
          </Button>
        </InputGroup>
        <Form.Text className='text-muted'>
          A szót szótári alakban add meg. (Igéknél ez az E/3 alak.)
        </Form.Text>
      </Form>
    </div>
  )
}

export default App
