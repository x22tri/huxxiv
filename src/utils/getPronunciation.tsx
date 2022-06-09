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
// const splitPhonemes = (str: string): string[] | null =>
//   str.match(new RegExp([...PHONEMES.values()].sort().reverse().join('|'), 'gi'))

const isMatch = (phonemeElement: string, symbol: string) =>
  Object.keys(CATEGORIES).includes(symbol)
    ? !!CATEGORIES[symbol as keyof typeof CATEGORIES].includes(phonemeElement)
    : !!(symbol === phonemeElement)

const getPronunciation = (wordObject: Keyword, year: number) => {
  const phonemic = wordObject.phonemic || convertWordToPhonemes(wordObject.word)

  const concurrentPronunciations: PhoneticInfo[] = phonemic.map(elem => ({
    main: elem,
    variants: [],
  }))

  // This is needed to break up affricates in IPA (with tie bars) that count as multiple characters.
  let word = phonemic.join('').split('')

  // k a ptS o S
  // k a tS: o S

  // ar r a
  // a: r a - merge phonemes

  for (let rule of SOUND_CHANGES) {
    const [target, change, environment, exception, els] = rule.change.split('/')
    // console.log(target)
    // let splitRule = splitPhonemes(target) || []
    // if (!splitRule?.length) continue
    // console.log(splitRule)
    // for (let ph of phonemic) {
    // for (let phoneme of concurrentPronunciations) {
    //   //To-Do: check if target is multiple phonemes, if it is, split and check if found in phoneme array.
    //   console.log(phoneme)

    // let idx = 0
    // while (idx < word.length) {
    //   idx++
    // }

    // console.log(target.split('').map(e => Object.keys(CATEGORIES).includes(e)))
    // console.log(word.split(''))

    // console.log(target)
    for (let [index, element] of word.entries()) {
      // Finds the first character or category in the rule target.
      if (isMatch(element, target[0])) {
        let allMatch = true
        let changedFrom = [element]
        // Verifies multi-character matches.
        for (let j = 1; j < target.split('').length; j++) {
          !(word[index + j] && isMatch(word[index + j], target[j]))
            ? (allMatch = false)
            : changedFrom.push(word[index + j])
        }
        if (allMatch) {
          let changedFromStr = changedFrom.join('')
          word = word.join('').replaceAll(changedFromStr, change).split('')
          console.log(changedFromStr + ', ' + change)
        }
      }
    }

    // console.log(target)
    // console.log(change)

    // word = word.replaceAll(target, change)
    // console.log(word)

    // let found
    // // if (splitRule.length === 1) {
    // // If target is a category, check if the current phoneme is in that category.
    // // If target is a regular phoneme, check if the current phoneme is that phoneme.
    // found = Object.keys(CATEGORIES).includes(target)
    //   ? !!CATEGORIES[target as keyof typeof CATEGORIES].includes(ph)
    //   : !!(target === ph)
    // // }

    // console.log(found)

    //   // if (splitRule.length > 1) {
    //   //   let groupFound = true
    //   //   for (let i = 0; i < splitRule.length; i++) {
    //   //     let x = Object.keys(CATEGORIES).includes(splitRule[i])
    //   //       ? !!CATEGORIES[splitRule[i] as keyof typeof CATEGORIES].includes(
    //   //           phoneme.main
    //   //         )
    //   //       : !!(splitRule[i] === phoneme.main)
    //   //     console.log(x + ': ' + splitRule[i] + '(' + phoneme.main + ')')

    //   //   }
    //   // }

    //   if (found) {
    //     switch (handleAppear(rule, year)) {
    //       case 'appearanceInProgress':
    //       case 'concurrentVariants':
    //         phoneme.variants.push({
    //           id: rule.id,
    //           new: change,
    //           appears: rule.appears,
    //           disappears: rule.disappears,
    //           note: rule.note,
    //         })
    //         break
    //       case 'gonePast':
    //         phoneme.main = change
    //         break
    //       case 'disappearanceInProgress':
    //         phoneme.variants.push({
    //           id: rule.id,
    //           old: phoneme.main,
    //           appears: rule.appears,
    //           disappears: rule.disappears,
    //           note: rule.note,
    //         })
    //         phoneme.main = change
    //         break
    //     }
    //   }
    // }
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
