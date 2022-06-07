import { Keyword, PhoneticInfo, SoundChange } from '../types'
import { SOUND_CHANGES, CATEGORIES } from '../database/SOUND_CHANGES'
import PHONEMES from '../database/PHONEMES'
import { handleAppear } from './appearance-utils'

// Sort letters by length (longest to shortest) to find trigraphs before digraphs before monographs.
const convertWordToLetters = (word: string): string[] | null =>
  word.match(new RegExp([...PHONEMES.keys()].sort().reverse().join('|'), 'gi'))

const convertWordToPhonemes = (word: string): string[] =>
  convertWordToLetters(word)?.map(letter => PHONEMES.get(letter) || '') || []

// Does roughly the same as convertWordToLetters, but is used for strings of phonemes.
const splitPhonemes = (str: string): string[] | null =>
  str.match(new RegExp([...PHONEMES.values()].sort().reverse().join('|'), 'gi'))

const getPronunciation = (wordObject: Keyword, year: number) => {
  const phonemic = wordObject.phonemic || convertWordToPhonemes(wordObject.word)

  const concurrentPronunciations: PhoneticInfo[] = phonemic.map(elem => ({
    main: elem,
    variants: [],
  }))

  // k a ptS o S
  // k a tS: o S

  // ar r a
  // a: r a - merge phonemes

  for (let rule of SOUND_CHANGES) {
    const [target, change, environment, exception, els] = rule.change.split('/')
    let splitRule = splitPhonemes(target) || []
    if (!splitRule?.length) continue
    console.log(splitRule)

    for (let phoneme of concurrentPronunciations) {
      //To-Do: check if target is multiple phonemes, if it is, split and check if found in phoneme array.

      let found
      if (splitRule.length === 1) {
        // If target is a category, check if the current phoneme is in that category.
        // If target is a regular phoneme, check if the current phoneme is that phoneme.
        found = Object.keys(CATEGORIES).includes(target)
          ? !!CATEGORIES[target as keyof typeof CATEGORIES].includes(
              phoneme.main
            )
          : !!(target === phoneme.main)
      }

      // if (splitRule.length > 1) {
      //   let groupFound = true
      //   for (let i = 0; i < splitRule.length; i++) {
      //     let x = Object.keys(CATEGORIES).includes(splitRule[i])
      //       ? !!CATEGORIES[splitRule[i] as keyof typeof CATEGORIES].includes(
      //           phoneme.main
      //         )
      //       : !!(splitRule[i] === phoneme.main)
      //     console.log(x + ': ' + splitRule[i] + '(' + phoneme.main + ')')

      //   }
      // }

      if (found) {
        switch (handleAppear(rule, year)) {
          case 'appearanceInProgress':
          case 'concurrentVariants':
            phoneme.variants.push({
              id: rule.id,
              new: change,
              appears: rule.appears,
              disappears: rule.disappears,
              note: rule.note,
            })
            break
          case 'gonePast':
            phoneme.main = change
            break
          case 'disappearanceInProgress':
            phoneme.variants.push({
              id: rule.id,
              old: phoneme.main,
              appears: rule.appears,
              disappears: rule.disappears,
              note: rule.note,
            })
            phoneme.main = change
            break
        }
      }
    }
  }

  return concurrentPronunciations
}

const getMainPronunciation = (concurrentPronunciations: PhoneticInfo[]) =>
  concurrentPronunciations
    .map(phoneme => (typeof phoneme === 'string' ? phoneme : phoneme.main))
    .join('')

const getNumberOfVariants = (concurrentPronunciations: PhoneticInfo[]) =>
  concurrentPronunciations.filter(elem => elem.variants.length).length

export {
  convertWordToLetters,
  getPronunciation,
  getMainPronunciation,
  getNumberOfVariants,
}
