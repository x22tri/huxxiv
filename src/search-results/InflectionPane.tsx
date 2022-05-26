import { useNoFlashOnMount, Flasher } from '../utils/useNoFlashOnMount'
import Table from 'react-bootstrap/Table'
import InflectionTableNounAdj from './InflectionTableNounAdj'
import { Inflection, Keyword } from '../types'

const InflectionPane = ({
  inflection,
  mainKeyword,
  year,
}: {
  inflection: Inflection
  mainKeyword: Keyword
  year: number
}) => {
  const preventFlashOnMount = useNoFlashOnMount()

  return (
    <Table bordered responsive className='mb-0'>
      {inflection.partOfSpeech === 'melléknév' && (
        <InflectionTableNounAdj {...{ inflection, mainKeyword, year }} />
      )}
    </Table>
  )
}

export default InflectionPane
