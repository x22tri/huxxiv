import { Keyword, PhoneticInfo, SoundChange } from '../types'

import { SOUND_CHANGES } from '../database/SOUND_CHANGES'
import GRAPH_TO_PHONEME from '../database/GRAPH_TO_PHONEME'
import { handleAppear } from './appearance-utils'

const convertKeywordToLetters = (keyword: string): string[] | null =>
  // Sort letters by length (longest to shortest) to find trigraphs before digraphs before monographs.
  keyword.match(
    new RegExp(
      GRAPH_TO_PHONEME.map(i => i.letter)
        .sort()
        .reverse()
        .join('|'),
      'gi'
    )
  )

const convertKeywordToPhonemes = (keyword: string): string[] => {
  let phonemicResult: string[] = []
  convertKeywordToLetters(keyword)?.forEach(letter => {
    const phonemeObject = GRAPH_TO_PHONEME.find(i => i.letter === letter)
    if (phonemeObject) phonemicResult.push(phonemeObject.phoneme)
  })

  return phonemicResult
}

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
    for (let phoneme of concurrentPronunciations) {
      let [target, change] = rule.change.split('/')
      if (target === phoneme.main && change) {
        switch (handleAppear(rule, currentYear)) {
          case 'appearanceInProgress':
          case 'concurrentVariants':
            phoneme.main = target
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
            phoneme.main = change
            phoneme.variants.push({
              id: rule.id,
              old: target,
              appears: rule.appears,
              disappears: rule.disappears,
              note: rule.note,
            })
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
