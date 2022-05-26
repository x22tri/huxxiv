import INFLECTION_CHANGES from '../database/INFLECTION_CHANGES'
import { Declension, Inflection } from '../types'
import { handleAppear } from './appearance-utils'

const getLinkingVowels = (
  vowelHarmony: 'o' | 'e' | 'ö',
  lowVowelStem: boolean = false
) => {
  const linkingVowelDictionary = {
    o: ['a', 'á', 'o', 'ó', 'u', lowVowelStem ? 'a' : 'o'],
    e: ['e', 'é', 'e', 'ő', 'ü', 'e'],
    ö: ['e', 'é', 'ö', 'ő', 'ü', lowVowelStem ? 'e' : 'ö'],
  }

  let [a, aa, o, oo, u, pl] = linkingVowelDictionary[vowelHarmony]
  return [a, aa, o, oo, u, pl]
}

const getBaseInflection = (
  stem: string,
  inflection: Inflection
): Declension => {
  const { vowelHarmony, partOfSpeech, inflectionType } = inflection
  const lowVowelStem = !!(
    inflectionType === 'nyitótő' || partOfSpeech === 'melléknév'
  )

  const [a, aa, o, oo, u, pl] = getLinkingVowels(vowelHarmony, lowVowelStem)

  // To-Do: plural stem finder probably has to be done separately
  const plStem = `${stem}${pl}k`

  return {
    nom_sg: { main: stem },
    acc_sg: {
      main: lowVowelStem ? `${stem}${a}t` : `${stem}t`,
      variants: lowVowelStem ? [`${stem}t`] : [],
    },
    dat_sg: { main: `${stem}n${a}k` },
    nom_pl: { main: `${plStem}` },
    acc_pl: { main: `${plStem}${a}t` },
    dat_pl: { main: `${plStem}n${a}k` },
  }
}

const getInflection = (
  stem: string,
  inflection: Inflection,
  year: number
): Declension => {
  let cases = getBaseInflection(stem, inflection)

  INFLECTION_CHANGES.forEach(change => {
    Object.keys(cases).forEach(grammaticalCase => {
      // console.log(grammaticalCase)
      if (change.targetForm === grammaticalCase) {
        switch (handleAppear(change, year)) {
          case 'appearanceInProgress':
            console.log(grammaticalCase)
            // phoneme.main = rule.target
            // phoneme.variants.push({
            //   id: rule.id,
            //   new: rule.change,
            //   appears: rule.appears,
            //   disappears: rule.disappears,
            //   note: rule.note,
            // })
            // !activeRules.includes(rule) && activeRules.push(rule)
            break
          case 'notReachedYet':
            // phoneme.main = rule.target
            // activeRules.includes(rule) &&
            //   activeRules.splice(activeRules.indexOf(rule))
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
    })
  })

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
