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

import logo from './assets/hun2500logo.png'

const AppNavbar = ({
  // searchTerm,
  // setSearchTerm,
  wordSearcher,
}: {
  // searchTerm: string
  // setSearchTerm: Dispatch<SetStateAction<string>>
  wordSearcher: JSX.Element
}) => {
  return (
    <Navbar bg='white' expand='lg' fixed='top' className='d-flex flex-nowrap'>
      <Container fluid>
        <Col>
          <Navbar.Brand href='/'>
            <img src={logo} alt='Logó' width='60' height='30' />
          </Navbar.Brand>
        </Col>
        <Col className='flex-fill'>{wordSearcher}</Col>
        <Col />
      </Container>
    </Navbar>
  )
}

export default AppNavbar
