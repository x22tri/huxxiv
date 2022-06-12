import INFLECTION_CHANGES from '../database/INFLECTION_CHANGES'
import {
  CaseNameWithNumber,
  Declension,
  PartOfSpeech,
  VowelHarmony,
  InflectionType,
} from '../types'
import { handleAppear, notOutOfBounds } from './appearance-utils'
import { convertWordToLetters } from './getPronunciation'

// A list of vowels used in suffixes. Destructured as [a, aa, o, oo, u].
const linkingVowelDictionary = {
  o: ['a', 'á', 'o', 'ó', 'u'],
  e: ['e', 'é', 'e', 'ő', 'ü'],
  ö: ['e', 'é', 'ö', 'ő', 'ü'],
}

// A function used to get the base inflection (in 2000) which the changes will build on.
const getBaseInflection = (
  mainKeyword: string,
  partOfSpeech: PartOfSpeech,
  vowelHarmony: VowelHarmony,
  classes: InflectionType[] | undefined
): [Declension, string, string] => {
  // const { vowelHarmony, partOfSpeech, classes } = inflection
  const lowStem = classes?.includes('nyitótő') || partOfSpeech === 'melléknév'

  const [a, aa, o, oo, u] = linkingVowelDictionary[vowelHarmony]
  const lowVowel = lowStem ? a : o

  let stem2Base = mainKeyword

  const letters = convertWordToLetters(mainKeyword)
  if (!letters) throw new Error('A szót nem lehetett betűire bontani.')

  // Finds the vowel to elide or change in vowel elision / shortening stems.
  if (classes?.includes('hangkivető')) {
    letters.splice(letters.length - 2, 1)
    stem2Base = letters.join('')
  }

  if (classes?.includes('rövidülő')) {
    letters[letters.length - 2] = letters[letters.length - 2]
      .replace('á', 'a')
      .replace('é', 'e')
    stem2Base = letters.join('')
  }

  let accStem = `${stem2Base}${lowVowel}`,
    speStem = `${mainKeyword}${o}`,
    lowVowelSpeStem = `${stem2Base}${o}`,
    plStem = `${stem2Base}${lowVowel}`

  const disappearingSibilantLinkVowel =
    letters[letters.length - 1] === 's' && partOfSpeech === 'melléknév'
  // To-Do: 's' should be sibilant category

  let acc_sg

  if (disappearingSibilantLinkVowel) {
    acc_sg = [
      {
        form: `${accStem}t`,
        disappears: [2050, 2100] as [number, number],
      },
      { form: `${mainKeyword}t` },
    ]
  } else if (classes?.includes('rövidülő')) {
    acc_sg = [
      {
        form: `${accStem}t`,
        disappears: [2080, 2140] as [number, number],
      },
    ]
  } else {
    acc_sg = [{ form: `${accStem}t` }]
  }

  const spe_sg = classes?.includes('rövidülő')
    ? [
        {
          form: `${speStem}n`,
          disappears: [2100, 2150] as [number, number],
        },
      ]
    : [{ form: `${speStem}n` }]

  return [
    {
      nom_sg: [{ form: mainKeyword }],
      acc_sg,
      dat_sg: [{ form: `${mainKeyword}n${a}k`, disappears: [2100, 2200] }],
      spe_sg,
      nom_pl: [{ form: `${plStem}k` }],
      acc_pl: [{ form: `${plStem}k${a}t` }],
      dat_pl: [{ form: `${plStem}kn${a}k`, disappears: [2100, 2200] }],
      spe_pl: [{ form: `${plStem}k${o}n` }],
    },
    plStem,
    lowVowelSpeStem,
  ]
}

const getInflection = (
  mainKeyword: string,
  partOfSpeech: PartOfSpeech,
  vowelHarmony: VowelHarmony,
  classes: InflectionType[] | undefined,
  year: number
): Declension => {
  let [cases, plStem, lowVowelSpeStem] = getBaseInflection(
    mainKeyword,
    partOfSpeech,
    vowelHarmony,
    classes
  )

  // Makes disappearing elements in the base inflection disappear.
  for (let grammaticalCase of Object.keys(cases)) {
    cases[grammaticalCase as CaseNameWithNumber] = cases[
      grammaticalCase as CaseNameWithNumber
    ].filter(gc => notOutOfBounds(gc, year))
  }

  const stemMap = new Map([
    ['%STEM%', mainKeyword],
    ['%PLURAL_STEM%', plStem],
    ['%LOW_VOWEL_SUPERESSIVE_STEM%', lowVowelSpeStem], // works for front but not back vowels: tehenek - tehenen but szamarak - szamaron. fix!
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
        // Don't run if the change has a class and it doesn't match the word's classes.
        if (
          change.classes &&
          !change.classes?.some(
            c =>
              classes?.includes(c as InflectionType) ||
              c === vowelHarmony ||
              c === partOfSpeech
          )
        ) {
          break
        } else {
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
  }

  return {
    nom_sg: cases.nom_sg,
    acc_sg: cases.acc_sg,
    dat_sg: cases.dat_sg,
    spe_sg: cases.spe_sg,
    nom_pl: cases.nom_pl,
    acc_pl: cases.acc_pl,
    dat_pl: cases.dat_pl,
    spe_pl: cases.spe_pl,
  }
}

export default getInflection
export type { Declension }
