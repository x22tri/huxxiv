import { Keyword, ConcurrentPronunciation, Rule } from '../types'

import { RULES } from '../database/RULES'
import GRAPH_TO_PHONEME from '../database/GRAPH_TO_PHONEME'
import { handleAppear } from './appearance-utils'

const convertKeywordToPhonemes = (keyword: string): string[] => {
  // Sort letters by length (longest to shortest) and make a Regex out of it.
  const keywordBreakdownToLetters = keyword.match(
    new RegExp(
      GRAPH_TO_PHONEME.map(i => i.letter)
        .sort()
        .reverse()
        .join('|'),
      'gi'
    )
  )

  let phonemicResult: string[] = []
  keywordBreakdownToLetters?.forEach(letter => {
    const phonemeObject = GRAPH_TO_PHONEME.find(i => i.letter === letter)
    if (phonemeObject) phonemicResult.push(phonemeObject.phoneme)
  })

  return phonemicResult
}

const getPronunciation = (
  wordObject: Keyword,
  currentYear: number
): [string[], (string | ConcurrentPronunciation)[], Rule[]] => {
  let phonemic: string[] =
    wordObject.phonemic || convertKeywordToPhonemes(wordObject.word)

  const concurrentPronunciations: (string | ConcurrentPronunciation)[] =
    JSON.parse(JSON.stringify(phonemic))

  const activeRules: Rule[] = []

  RULES.forEach(rule => {
    concurrentPronunciations.forEach((phoneme, index) => {
      if (rule.target === phoneme && rule.change) {
        switch (handleAppear(rule, currentYear)) {
          case 'appearanceInProgress':
            concurrentPronunciations[index] = {
              id: rule.id,
              main: rule.target,
              new: rule.change,
              appears: rule.appears,
              note: rule.note,
            }
            !activeRules.includes(rule) && activeRules.push(rule)
            break
          case 'notReachedYet':
            concurrentPronunciations[index] = rule.target
            activeRules.includes(rule) &&
              activeRules.splice(activeRules.indexOf(rule))
            break
          case 'gonePast':
            concurrentPronunciations[index] = rule.change
            activeRules.includes(rule) &&
              activeRules.splice(activeRules.indexOf(rule))
            break
          case 'disappearanceInProgress':
            concurrentPronunciations[index] = {
              id: rule.id,
              main: rule.change,
              old: rule.target,
              disappears: rule.disappears,
              note: rule.note,
            }
            !activeRules.includes(rule) && activeRules.push(rule)
            break
        }
      }
    })
  })

  // console.log(activeRules)

  return [phonemic, concurrentPronunciations, activeRules]
}

const getMainPronunciation = (
  concurrentPronunciations: (string | ConcurrentPronunciation)[]
) =>
  concurrentPronunciations
    .map(phoneme => (typeof phoneme === 'string' ? phoneme : phoneme.main))
    .join('')

const getNumberOfVariants = (
  concurrentPronunciations: (string | ConcurrentPronunciation)[]
) =>
  concurrentPronunciations.filter(element => typeof element === 'object').length

export { getPronunciation, getMainPronunciation, getNumberOfVariants }

// code v2:
// check all rules for all phonemes in Phonemic
// (phonemes in targets, as well as phonemes in "change" attributes with currentYear < disappears[1])
// for every phoneme, if it has neither an "appears" or a "disappears", display it normally
// if it has "disappears" but no "appears", throw error (a phoneme cannot disappear without something else taking its place?)
// if it has "appears", add +1 if currentYear >= appears[0] (&& currentYear < disappears[1])
// (i.e. if handleAppear = true)
// clicking on +1 displays in a separate component like "target ~ change" (e.g. "ɒ ~ ɑ") and "note" if present.
// if currentYear < appears[1], display new main pronunciation (replace target with change in Phonemic?)
// and make it the basis of new changes
