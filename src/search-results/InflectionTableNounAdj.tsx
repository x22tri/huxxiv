import { useState } from 'react'
import getInflection, { Declension } from '../utils/getInflection'
import { CaseName, Inflection, Keyword } from '../types'
import { CASE_NAMES, MISC_NAMES } from '../database/CASE_NAMES'
import './InflectionTableNounAdj.css'

const caseNames = Object.keys(CASE_NAMES) as CaseName[]

const CaseVariants = ({ cases }: { cases: string[] }) => {
  const [activeCase, setActiveCase] = useState(0)
  return (
    <p className='case-variant'>
      <span>{cases[activeCase]}</span>
      <span
        className='case-changer-bullet-container'
        onClick={() =>
          setActiveCase(prev => (prev + 1 > cases.length - 1 ? 0 : prev + 1))
        }
      >
        {cases.map((c, index) => (
          <span className='case-changer-bullet' key={c}>
            {index === activeCase ? '•' : '◦'}
          </span>
        ))}
      </span>
    </p>
  )
}

const InflectionTableNounAdj = ({
  inflection,
  mainKeyword,
  year,
}: {
  inflection: Inflection
  mainKeyword: Keyword
  year: number
}) => {
  const cases = getInflection(mainKeyword.word, inflection, year) as Declension
  const isCaseArray = (caseOrCaseArray: string | string[]) =>
    Array.isArray(caseOrCaseArray) && caseOrCaseArray.length > 1

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
            <td>
              {isCaseArray(cases[`${caseName}_sg`]) ? (
                <CaseVariants cases={cases[`${caseName}_sg`] as string[]} />
              ) : (
                cases[`${caseName}_sg`]
              )}
            </td>
            <td>{cases[`${caseName}_pl`]}</td>
          </tr>
        ))}
      </tbody>
    </>
  )
}

export default InflectionTableNounAdj
