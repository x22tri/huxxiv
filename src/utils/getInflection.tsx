import INFLECTIONS2000 from '../database/INFLECTIONS2000'
import { Declension, Inflection } from '../types'

const getLinkingVowels = (
  vowelHarmony: 'o' | 'e' | 'ö',
  lowVowelStem: boolean = false
) => {
  let a, aa, o, oo, u, pl
  switch (vowelHarmony) {
    case 'o':
      a = 'a'
      aa = 'á'
      o = 'o'
      oo = 'ó'
      u = 'u'
      pl = lowVowelStem ? 'a' : 'o'
      break
    case 'e':
      a = 'e'
      aa = 'é'
      o = 'ö'
      oo = 'ő'
      u = 'ü'
      pl = 'e'
      break
    case 'ö':
      a = 'e'
      aa = 'é'
      o = 'e'
      oo = 'ő'
      u = 'ü'
      pl = lowVowelStem ? 'e' : 'ö'
      break
  }
  return [a, aa, o, oo, u, pl]
}

const getInflection = (stem: string, inflection: Inflection): Declension => {
  const { vowelHarmony, partOfSpeech, inflectionType } = inflection

  const [a, aa, o, oo, u, pl] = getLinkingVowels(
    vowelHarmony,
    inflectionType === 'nyitótő' || partOfSpeech === 'melléknév'
  )

  return {
    nom_sg: stem,
    acc_sg: `${stem}t`,
    dat_sg: `${stem}n${a}k`,
    nom_pl: `${stem}${pl}k`,
    acc_pl: `${stem}${pl}k${a}t`,
    dat_pl: `${stem}${pl}kn${a}k`,
  }
}

export default getInflection
export type { Declension }
