import { Word } from './CHARS'
import { ErrorMessage } from './App'
import './SearchResults.css'

interface SearchResultsProps {
  searchResult: Word | ErrorMessage
}

const ErrorField = ({ error }: { error: ErrorMessage }) => {
  return <div className='error-field d-flex my-auto'>{error}</div>
}

const WordOverview = ({ word }: { word: Word }) => {
  return <div>{word.word}</div>
}

const SearchResults = ({ searchResult }: SearchResultsProps) => {
  if (typeof searchResult === 'string') {
    return <ErrorField error={searchResult} />
  } else {
    return <WordOverview word={searchResult} />
  }
}

export default SearchResults
