import INFLECTION_CHANGES from '../database/INFLECTION_CHANGES'
import { Changeable, Declension, Inflection } from '../types'
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

const getStems = () => {}

const getBaseInflection = (
  stem: string,
  inflection: Inflection
): [Declension, string] => {
  const { vowelHarmony, partOfSpeech, inflectionType } = inflection
  const lowVowelStem = !!(
    inflectionType === 'nyitótő' || partOfSpeech === 'melléknév'
  )

  const [a, aa, o, oo, u, pl] = getLinkingVowels(vowelHarmony, lowVowelStem)

  // To-Do: plural stem finder probably has to be done separately
  const pluralStem = `${stem}${pl}k`

  return [
    {
      nom_sg: [{ form: stem }],
      acc_sg: [
        ...(lowVowelStem
          ? [
              {
                form: `${stem}${a}t`,
                disappears: [2050, 2100] as [number, number],
              },
            ]
          : []),
        { form: `${stem}t` },
      ],
      dat_sg: [{ form: `${stem}n${a}k` }],
      nom_pl: [{ form: `${pluralStem}` }],
      acc_pl: [{ form: `${pluralStem}${a}t` }],
      dat_pl: [{ form: `${pluralStem}n${a}k` }],
    },
    pluralStem,
  ]
}

const getInflection = (
  stem: string,
  inflection: Inflection,
  year: number
): Declension => {
  let [cases, pluralStem] = getBaseInflection(stem, inflection)

  const stemMap = new Map([
    ['%STEM%', stem],
    ['%PLURAL_STEM%', pluralStem],
  ])

  const stemReplacer = (change: string): string =>
    change.replace(
      new RegExp(Array.from(stemMap.keys()).join('|'), 'gi'),
      matched => stemMap.get(matched) || 'Hiba'
    )

  for (let change of INFLECTION_CHANGES) {
    for (let grammaticalCase of Object.keys(cases)) {
      if (change.targetForm === grammaticalCase) {
        // console.log(handleAppear(change, year))
        switch (handleAppear(change, year)) {
          case 'appearanceInProgress':
          case 'concurrentVariants':
            cases[change.targetForm as keyof Declension].push({
              form: stemReplacer(change.change),
              appears: change.appears,
            })
            break
          // case 'notReachedYet':
          // phoneme.main = rule.target
          // activeRules.includes(rule) &&
          //   activeRules.splice(activeRules.indexOf(rule))
          // break
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
