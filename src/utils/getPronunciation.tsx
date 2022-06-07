import { Keyword, PhoneticInfo, SoundChange } from '../types'

import { SOUND_CHANGES, CATEGORIES } from '../database/SOUND_CHANGES'
import GRAPH_TO_PHONEME from '../database/GRAPH_TO_PHONEME'
import { handleAppear } from './appearance-utils'

const convertKeywordToLetters = (keyword: string): string[] | null =>
  // Sort letters by length (longest to shortest) to find trigraphs before digraphs before monographs.
  keyword.match(
    new RegExp([...GRAPH_TO_PHONEME.keys()].sort().reverse().join('|'), 'gi')
  )

const convertKeywordToPhonemes = (keyword: string): string[] =>
  convertKeywordToLetters(keyword)?.map(
    letter => GRAPH_TO_PHONEME.get(letter) || ''
  ) || []

const getPronunciation = (
  wordObject: Keyword,
  currentYear: number
): [string[], PhoneticInfo[], SoundChange[]] => {
  const phonemic: string[] =
    wordObject.phonemic || convertKeywordToPhonemes(wordObject.word)

  const concurrentPronunciations: PhoneticInfo[] = JSON.parse(
    JSON.stringify(phonemic.map(elem => ({ main: elem, variants: [] })))
  )

  const activeSoundChanges: SoundChange[] = []

  for (let rule of SOUND_CHANGES) {
    //To-Do: check if target is multiple phonemes, if it is, split and check if found in phoneme array.
    const [target, change, environment, exception, els] = rule.change.split('/')

    for (let phoneme of concurrentPronunciations) {
      // If target is a category, check if the current phoneme is in that category.
      // If target is a regular phoneme, check if the current phoneme is that phoneme.
      let found = Object.keys(CATEGORIES).includes(target)
        ? !!CATEGORIES[target as keyof typeof CATEGORIES].includes(phoneme.main)
        : !!(target === phoneme.main)

      if (found) {
        switch (handleAppear(rule, currentYear)) {
          case 'appearanceInProgress':
          case 'concurrentVariants':
            phoneme.variants.push({
              id: rule.id,
              new: change,
              appears: rule.appears,
              disappears: rule.disappears,
              note: rule.note,
            })
            if (!activeSoundChanges.includes(rule)) {
              activeSoundChanges.push(rule)
            }
            break

          case 'gonePast':
            phoneme.main = change
            if (activeSoundChanges.includes(rule)) {
              activeSoundChanges.splice(activeSoundChanges.indexOf(rule))
            }
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
            if (activeSoundChanges.includes(rule)) {
              activeSoundChanges.push(rule)
            }
            break
        }
      }
    }
  }

  return [phonemic, concurrentPronunciations, activeSoundChanges]
}

const getMainPronunciation = (concurrentPronunciations: PhoneticInfo[]) =>
  concurrentPronunciations
    .map(phoneme => (typeof phoneme === 'string' ? phoneme : phoneme.main))
    .join('')

const getNumberOfVariants = (concurrentPronunciations: PhoneticInfo[]) =>
  concurrentPronunciations.filter(elem => elem.variants.length).length

export {
  convertKeywordToLetters,
  getPronunciation,
  getMainPronunciation,
  getNumberOfVariants,
}
