import { useNoFlashOnMount, Flasher } from '../utils/useNoFlashOnMount'
import Table from 'react-bootstrap/Table'
import InflectionTableNounAdj from './InflectionTableNounAdj'
import { Inflection, Keyword } from '../types'

const InflectionPane = ({
  inflection,
  mainKeyword,
}: {
  inflection: Inflection
  mainKeyword: Keyword
}) => {
  const preventFlashOnMount = useNoFlashOnMount()

  return (
    <Table bordered responsive className='mb-0'>
      {inflection.partOfSpeech === 'melléknév' && (
        <InflectionTableNounAdj {...{ inflection, mainKeyword }} />
      )}
    </Table>
  )
}

export default InflectionPane
