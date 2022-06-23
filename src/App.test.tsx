import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'
import userEvent from '@testing-library/user-event'

it('renders App with search bar', () => {
  const app = render(<App />)
  const searchBar = app.getByRole('textbox')
  expect(searchBar).toBeInTheDocument()
})

it('loads a word that it finds in the database', async () => {
  render(<App />)
  const textbox = screen.getByRole('textbox')
  // For some reason, "userEvent.type(textbox, 'kapcsos')" yields an error - only the first letter gets typed in.
  userEvent.clear(textbox)
  // userEvent.type(textbox, 'k')
  // userEvent.type(textbox, 'a')
  // userEvent.type(textbox, 'p')
  // userEvent.type(textbox, 'c')
  // userEvent.type(textbox, 's')
  // userEvent.type(textbox, 'o')
  // userEvent.type(textbox, 's')
  userEvent.type(textbox, 'kapcsos')
  userEvent.click(screen.getByRole('button'))

  const foundWordCard = await screen.findByText(/JELENTÉS/)
  expect(foundWordCard).toBeInTheDocument()
})

it('shows error when a word not in the database is entered', async () => {
  render(<App />)
  userEvent.type(screen.getByRole('textbox'), 'xzyjsg')
  userEvent.click(screen.getByRole('button'))
  const notFound = await screen.findByText(/nem található/) // String values don't work for some reason.
  expect(notFound).toBeInTheDocument()
})
