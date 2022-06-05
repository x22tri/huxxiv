import getInflection, { Declension } from '../utils/getInflection'
import { CaseName, GrammaticalCaseForm, Inflection, Keyword } from '../types'
import { CASE_NAMES, MISC_NAMES } from '../database/CASE_NAMES'
import { calculateOpacity } from '../utils/appearance-utils'
import './InflectionTableNounAdj.css'

const caseNames = Object.keys(CASE_NAMES) as CaseName[]

// To-Do: make elements take over the "main" inflection and make obsolete elements disappear

interface GrammaticalCaseFormWithOpacity extends GrammaticalCaseForm {
  opacity: number
}

const findMaxOpacityElementIndex = (
  array: GrammaticalCaseForm[],
  year: number
) => {
  const arrayWithOpacities = array.map(elem => ({
    ...elem,
    opacity: calculateOpacity(elem, year),
  }))

  console.log(arrayWithOpacities)

  const maxOpacityElementIndex = arrayWithOpacities.findIndex(
    elem => elem.opacity === Math.max(...arrayWithOpacities.map(e => e.opacity))
  )

  return [
    arrayWithOpacities[
      maxOpacityElementIndex
    ] as GrammaticalCaseFormWithOpacity,
    arrayWithOpacities.filter(
      (_, index) => index !== maxOpacityElementIndex
    ) as GrammaticalCaseFormWithOpacity[],
  ]
}
const CaseDisplay = ({
  caseArray,
  year,
}: {
  caseArray: GrammaticalCaseForm[]
  year: number
}) => {
  if (caseArray.length < 1) {
    throw new Error('Nincs aktív morféma')
    // To-Do: remove the row altogether
  } else if (caseArray.length === 1) {
    return (
      <span
        style={{
          color: `rgba(0, 0, 0, ${calculateOpacity(caseArray[0], year)}`,
        }}
      >
        {caseArray[0].form}
      </span>
    )
  } else {
    // console.log(findMaxOpacityElementIndex(caseArray, year))
    const [main, rest] = findMaxOpacityElementIndex(caseArray, year) as [
      GrammaticalCaseFormWithOpacity,
      GrammaticalCaseFormWithOpacity[]
    ]
    return (
      <p className='case-variants'>
        <span
          style={{
            color: `rgba(0, 0, 0, ${main.opacity}`,
          }}
        >
          {main.form}
        </span>
        <span className='case-variants--variant'>
          {rest.map((variant, index) => (
            <span
              key={variant.form}
              style={{
                color: `rgba(0, 0, 0, ${variant.opacity}`,
              }}
            >
              {index >= 1 && ', '}
              <span>{variant.form}</span>
            </span>
          ))}
        </span>
      </p>
    )
  }
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
            <td className='col-md-2'>
              <strong>{CASE_NAMES[caseName]}</strong>
            </td>
            <td className='col-md-4'>
              <CaseDisplay caseArray={cases[`${caseName}_sg`]} {...{ year }} />
            </td>
            <td className='col-md-4'>
              <CaseDisplay caseArray={cases[`${caseName}_pl`]} {...{ year }} />
            </td>
          </tr>
        ))}
      </tbody>
    </>
  )
}

export default InflectionTableNounAdj
