import INFLECTIONS2000 from '../database/INFLECTIONS2000'
import { Declension, Inflection } from '../types'

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

const getInflection = (stem: string, inflection: Inflection): Declension => {
  const { vowelHarmony, partOfSpeech, inflectionType } = inflection
  const lowVowelStem = !!(inflectionType === 'nyitótő')

  // To-Do: plural stem finder probably has to be done separately

  const [a, aa, o, oo, u, pl] = getLinkingVowels(
    vowelHarmony,
    lowVowelStem || partOfSpeech === 'melléknév'
  )

  return {
    nom_sg: stem,
    acc_sg: [`${stem}t`].concat([`${stem}${a}t`]),
    dat_sg: `${stem}n${a}k`,
    nom_pl: `${stem}${pl}k`,
    acc_pl: `${stem}${pl}k${a}t`,
    dat_pl: `${stem}${pl}kn${a}k`,
  }
}

export default getInflection
export type { Declension }
