import getInflection, { Declension } from '../utils/getInflection'
import {
  CaseName,
  GrammaticalCaseForm,
  InflectionType,
  PartOfSpeech,
  VowelHarmony,
} from '../types'
import { CASE_NAMES, MISC_NAMES } from '../database/CASE_NAMES'
import { calculateOpacity } from '../utils/appearance-utils'
import './InflectionTableNounAdj.css'

const caseNames = Object.keys(CASE_NAMES) as CaseName[]

interface GrammaticalCaseFormWithOpacity extends GrammaticalCaseForm {
  opacity: number
}

const findMaxOpacityElementIndex = (
  array: GrammaticalCaseForm[],
  year: number
): [GrammaticalCaseFormWithOpacity, GrammaticalCaseFormWithOpacity[]] => {
  const arrayWithOpacities = array.map(elem => ({
    ...elem,
    opacity: calculateOpacity(elem, year),
  }))

  const maxOpacityElementIndex = arrayWithOpacities.findIndex(
    elem => elem.opacity === Math.max(...arrayWithOpacities.map(e => e.opacity))
  )

  return [
    arrayWithOpacities[maxOpacityElementIndex],
    arrayWithOpacities.filter((_, index) => index !== maxOpacityElementIndex),
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
    return <span>Hiba: Nincs aktív morféma.</span>
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
    const [main, rest] = findMaxOpacityElementIndex(caseArray, year)

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
  // inflection,
  partOfSpeech,
  vowelHarmony,
  classes,
  word,
  year,
}: {
  // inflection: Inflection
  partOfSpeech: PartOfSpeech
  vowelHarmony: VowelHarmony
  classes: InflectionType[] | undefined
  word: string
  year: number
}) => {
  const cases = getInflection(
    word,
    partOfSpeech,
    vowelHarmony,
    classes,
    year
  ) as Declension
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
