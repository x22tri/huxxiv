import INFLECTION_CHANGES from '../database/INFLECTION_CHANGES'
import {
  Changeable,
  CaseNameWithNumber,
  Declension,
  GrammaticalCaseForm,
  Inflection,
} from '../types'
import { handleAppear, notOutOfBounds } from './appearance-utils'
import { convertKeywordToLetters } from './getPronunciation'

const linkingVowelDictionary = {
  o: ['a', 'á', 'o', 'ó', 'u'],
  e: ['e', 'é', 'e', 'ő', 'ü'],
  ö: ['e', 'é', 'ö', 'ő', 'ü'],
}

const getBaseInflection = (
  mainKeyword: string,
  inflection: Inflection
): [Declension, string] => {
  const { vowelHarmony, partOfSpeech, inflectionType } = inflection
  const lowVowelStem = !!(
    inflectionType === 'nyitótő' || partOfSpeech === 'melléknév'
  )

  const [a, aa, o, oo, u] = linkingVowelDictionary[vowelHarmony]
  const lowVowel = lowVowelStem ? a : o

  let accStem, speStem, plStem
  let stem2Base = mainKeyword

  const vowelChangeStem = !!(
    inflectionType === 'hangkivető' || inflectionType === 'rövidülő'
  )

  // Finds the vowel to elide in vowel elision stems.
  if (vowelChangeStem) {
    let converted = convertKeywordToLetters(mainKeyword)
    if (converted) {
      console.log(converted)
      converted.splice(converted.length - 2, 1)
      stem2Base = converted.join('')
    }
  }

  accStem = `${stem2Base}${lowVowel}`
  plStem = `${stem2Base}${lowVowel}`

  const disappearingSibilantLinkVowel = true // To-Do: make class or rule for this

  const acc_sg = disappearingSibilantLinkVowel
    ? [
        {
          form: `${accStem}t`,
          disappears: [2050, 2100] as [number, number],
        },
        { form: `${mainKeyword}t` },
      ]
    : [{ form: `${mainKeyword}t` }]

  return [
    {
      nom_sg: [{ form: mainKeyword }],
      acc_sg: acc_sg,
      dat_sg: [{ form: `${mainKeyword}n${a}k` }],
      nom_pl: [{ form: `${plStem}k` }],
      acc_pl: [{ form: `${plStem}k${a}t` }],
      dat_pl: [{ form: `${plStem}kn${a}k` }],
    },
    plStem,
  ]
}

const getInflection = (
  mainKeyword: string,
  inflection: Inflection,
  year: number
): Declension => {
  let [cases, pluralStem] = getBaseInflection(mainKeyword, inflection)

  // Makes disappearing elements in the base inflection disappear.
  for (let grammaticalCase of Object.keys(cases)) {
    cases[grammaticalCase as CaseNameWithNumber] = cases[
      grammaticalCase as CaseNameWithNumber
    ].filter(gc => notOutOfBounds(gc, year))
  }

  const stemMap = new Map([
    ['%STEM%', mainKeyword],
    ['%PLURAL_STEM%', pluralStem],
  ])

  const stemReplacer = (change: string): string =>
    change.replace(
      new RegExp(Array.from(stemMap.keys()).join('|'), 'gi'),
      matched => stemMap.get(matched) || 'Hiba'
    )

  // Adds new inflection changes on top of the base inflection.
  for (let change of INFLECTION_CHANGES) {
    for (let grammaticalCase of Object.keys(cases)) {
      if (change.targetForm === grammaticalCase) {
        switch (handleAppear(change, year)) {
          case 'appearanceInProgress':
          case 'concurrentVariants':
            cases[change.targetForm as keyof Declension].push({
              form: stemReplacer(change.change),
              appears: change.appears,
            })
            break
          case 'gonePast':
            // phoneme.main = rule.change
            // activeRules.includes(rule) &&
            //   activeRules.splice(activeRules.indexOf(rule))
            break
          case 'disappearanceInProgress':
            // phoneme.main = rule.change
            // phoneme.variants.push({
            //   id: rule.id,
            //   old: rule.target,
            //   appears: rule.appears,
            //   disappears: rule.disappears,
            //   note: rule.note,
            // })
            // !activeRules.includes(rule) && activeRules.push(rule)
            break
        }
      }
    }
  }

  return {
    nom_sg: cases.nom_sg,
    acc_sg: cases.acc_sg,
    dat_sg: cases.dat_sg,
    nom_pl: cases.nom_pl,
    acc_pl: cases.acc_pl,
    dat_pl: cases.dat_pl,
  }
}

export default getInflection
export type { Declension }
