import getInflection, { Declension } from '../utils/getInflection'
import { CaseName, Inflection, Keyword } from '../types'
import { CASE_NAMES, MISC_NAMES } from '../database/CASE_NAMES'

const caseNames = Object.keys(CASE_NAMES) as CaseName[]

const InflectionTableNounAdj = ({
  inflection,
  mainKeyword,
}: {
  inflection: Inflection
  mainKeyword: Keyword
}) => {
  const cases = getInflection(mainKeyword.word, inflection) as Declension

  //   console.log(cases[caseName + '_sg'])

  return (
    <>
      <thead>
        <tr>
          <th></th>
          <th>{MISC_NAMES.sg}</th>
          <th>{MISC_NAMES.pl}</th>
        </tr>
      </thead>
      <tbody>
        {caseNames.map(caseName => (
          <tr key={caseName}>
            <td>
              <strong>{CASE_NAMES[caseName]}</strong>
            </td>
            <td>{cases[`${caseName}_sg`]}</td>
            <td>{cases[`${caseName}_pl`]}</td>
          </tr>
        ))}

        {/* <tr>
          <td>
            <strong>tárgyeset</strong>
          </td>
          <td>{cases.acc_sg}</td>
          <td>{cases.acc_pl}</td>
        </tr>
        <tr>
          <td>
            <strong>részes eset</strong>
          </td>
          <td>{cases.dat_sg}</td>
          <td>{cases.dat_pl}</td>
        </tr> */}
      </tbody>
    </>
  )
}

export default InflectionTableNounAdj
