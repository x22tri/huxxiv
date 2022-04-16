import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'

import logo from './assets/hun2500logo.png'
import './AppNavbar.css'

const AppNavbar = ({ wordSearcher }: { wordSearcher: JSX.Element }) => {
  return (
    <Navbar
      fixed='top'
      className='d-flex flex-nowrap border-bottom'
      id='app-navbar'
    >
      <Container fluid>
        <Col>
          <Navbar.Brand href='/'>
            <img src={logo} alt='Logó' height='30' />
          </Navbar.Brand>
        </Col>
        <Col className='flex-fill'>{wordSearcher}</Col>
        <Col />
      </Container>
    </Navbar>
  )
}

export default AppNavbar
