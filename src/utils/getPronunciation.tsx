import { Keyword, Rule, PhoneticInfo } from '../types'

import { RULES } from '../database/RULES'
import GRAPH_TO_PHONEME from '../database/GRAPH_TO_PHONEME'
import { handleAppear } from './appearance-utils'

const convertKeywordToPhonemes = (keyword: string): string[] => {
  // Sort letters by length (longest to shortest) to find trigraphs before digraphs before monographs.
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
): [string[], PhoneticInfo[], Rule[]] => {
  let phonemic: string[] =
    wordObject.phonemic || convertKeywordToPhonemes(wordObject.word)

  const concurrentPronunciations: PhoneticInfo[] = JSON.parse(
    JSON.stringify(phonemic.map(elem => ({ main: elem, variants: [] })))
  )

  const activeRules: Rule[] = []

  RULES.forEach(rule => {
    concurrentPronunciations.forEach((phoneme, index) => {
      let currentSound = phoneme.main

      if (rule.target === currentSound && rule.change) {
        switch (handleAppear(rule, currentYear)) {
          case 'appearanceInProgress':
            // case 'concurrentVariants':
            phoneme.main = rule.target
            phoneme.variants.push({
              id: rule.id,
              new: rule.change,
              appears: rule.appears,
              disappears: rule.disappears,
              note: rule.note,
            })
            !activeRules.includes(rule) && activeRules.push(rule)
            break
          case 'notReachedYet':
            phoneme.main = rule.target
            activeRules.includes(rule) &&
              activeRules.splice(activeRules.indexOf(rule))
            break
          case 'gonePast':
            phoneme.main = rule.change
            activeRules.includes(rule) &&
              activeRules.splice(activeRules.indexOf(rule))
            break
          case 'disappearanceInProgress':
            phoneme.main = rule.change
            phoneme.variants.push({
              id: rule.id,
              old: rule.target,
              appears: rule.appears,
              disappears: rule.disappears,
              note: rule.note,
            })
            !activeRules.includes(rule) && activeRules.push(rule)
            break
        }
      }
    })
  })

  return [phonemic, concurrentPronunciations, activeRules]
}

const getMainPronunciation = (concurrentPronunciations: PhoneticInfo[]) =>
  concurrentPronunciations
    .map(phoneme => (typeof phoneme === 'string' ? phoneme : phoneme.main))
    .join('')

const getNumberOfVariants = (concurrentPronunciations: PhoneticInfo[]) =>
  // concurrentPronunciations.filter(element => typeof element === 'object').length
  concurrentPronunciations.filter(elem => elem.variants.length).length

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
