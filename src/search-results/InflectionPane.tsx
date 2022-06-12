import Table from 'react-bootstrap/Table'
import InflectionTableNounAdj from './InflectionTableNounAdj'
import { InflectionType, PartOfSpeech, VowelHarmony } from '../types'

const InflectionPane = ({
  partOfSpeech,
  vowelHarmony,
  classes,
  word,
  year,
}: {
  partOfSpeech: PartOfSpeech
  vowelHarmony: VowelHarmony
  classes: InflectionType[] | undefined
  word: string
  year: number
}) => (
  <Table bordered responsive className='mb-0'>
    {(partOfSpeech === 'melléknév' || partOfSpeech === 'főnév') && (
      <InflectionTableNounAdj
        {...{ partOfSpeech, vowelHarmony, classes, word, year }}
      />
    )}
  </Table>
)

export default InflectionPane
