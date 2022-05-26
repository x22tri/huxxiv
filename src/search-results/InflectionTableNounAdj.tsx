import { useState } from 'react'
import getInflection, { Declension } from '../utils/getInflection'
import { CaseName, GrammaticalCase, Inflection, Keyword } from '../types'
import { CASE_NAMES, MISC_NAMES } from '../database/CASE_NAMES'
import './InflectionTableNounAdj.css'

const caseNames = Object.keys(CASE_NAMES) as CaseName[]

const CaseVariants = ({ cases }: { cases: GrammaticalCase }) => (
  <p className='case-variants'>
    <span>{cases.main}</span>
    <span className='case-variants--variant'>
      (
      {cases.variants?.length &&
        cases.variants.map((variant, index) => (
          <>
            {index >= 1 && ', '}
            <span key={variant}>{variant}</span>
          </>
        ))}
      )
    </span>
  </p>
)

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
  // const isCaseArray = (caseOrCaseArray: GrammaticalCase) =>
  //   caseOrCaseArray.variants && caseOrCaseArray.variants.length > 0

  const CaseDisplay = ({
    caseOrCaseArray,
  }: {
    caseOrCaseArray: GrammaticalCase
  }) =>
    caseOrCaseArray.variants && caseOrCaseArray.variants.length > 0 ? (
      <CaseVariants cases={caseOrCaseArray} />
    ) : (
      <>{caseOrCaseArray.main}</>
    )

  console.log(cases)

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
              <CaseDisplay caseOrCaseArray={cases[`${caseName}_sg`]} />
            </td>
            <td>
              <CaseDisplay caseOrCaseArray={cases[`${caseName}_pl`]} />
            </td>
          </tr>
        ))}
      </tbody>
    </>
  )
}

export default InflectionTableNounAdj
