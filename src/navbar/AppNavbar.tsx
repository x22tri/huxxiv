import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import './AppNavbar.css'

// const logo = require('../assets/hun2500logo.png')
// @ts-ignore
import logo from '../assets/hun2500logo.png'

const AppNavbar = ({ wordSearcher }: { wordSearcher: JSX.Element }) => (
  <Navbar fixed='top' className='d-flex flex-nowrap' id='app-navbar'>
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

export default AppNavbar
