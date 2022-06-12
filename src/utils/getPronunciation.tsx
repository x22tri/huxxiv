import { PronunciationChange, Word } from '../types'
import { SOUND_CHANGES, CATEGORIES } from '../database/SOUND_CHANGES'
import PHONEMES from '../database/PHONEMES'
import { handleAppear, notOutOfBounds } from './appearance-utils'

// Sort letters by length (longest to shortest) to find trigraphs before digraphs before monographs.
const convertWordToLetters = (word: string): string[] | null =>
  word.match(new RegExp([...PHONEMES.keys()].sort().reverse().join('|'), 'gi'))

const convertWordToPhonemes = (word: string): string[] =>
  convertWordToLetters(word)?.map(letter => PHONEMES.get(letter) || '') || []

// If symbol is a rule category, checks if phoneme is part of that category, otherwise checks if phoneme equals the symbol.
const isMatch = (phonemeElement: string, symbol: string) =>
  Object.keys(CATEGORIES).includes(symbol)
    ? !!CATEGORIES[symbol as keyof typeof CATEGORIES].includes(phonemeElement)
    : !!(symbol === phonemeElement)

const getPronunciation = (
  wordObject: Word,
  year: number
): [PronunciationChange[][], string] => {
  const phonemic = wordObject.phonemic || convertWordToPhonemes(wordObject.word)
  let word = phonemic.join('').split('') // Needed to break up affricates in IPA (with tie bars) that count as multiple characters.
  let rules: PronunciationChange[][] = []

  currentRule: for (let rule of SOUND_CHANGES) {
    if (handleAppear(rule, year) === 'notReachedYet') break
    const [target, change, environment, exception, els] = rule.change.split('/')

    for (let [index, element] of word.entries()) {
      // Find the first character or category in the rule target.
      if (isMatch(element, target[0])) {
        let from = [element] // The actual phonemes changed by the rule (=/= the rule target, which can include categories etc.)
        // Verify multi-character matches.
        for (let j = 1; j < target.split('').length; j++) {
          if (!word[index + j] || !isMatch(word[index + j], target[j])) {
            continue currentRule // No match - go to the next rule
          } else {
            from.push(word[index + j])
          }
        }

        // Replace the phoneme in the main pronunciation with the new phoneme if it's already established (appeared fully).
        if (
          handleAppear(rule, year) === 'concurrentVariants' ||
          handleAppear(rule, year) === 'disappearanceInProgress' ||
          handleAppear(rule, year) === 'gonePast'
        ) {
          word = word.join('').replaceAll(from.join(''), change).split('') // Do the replacement.
        }

        let chain // Check if this rule is part of a chain shift, i.e. if a previous change's result is this one's target.
        chain = rules.findIndex(r => r[r.length - 1].sound === from.join(''))
        if (chain !== -1) {
          rules[chain][rules[chain].length - 1].disappears = rule.disappears // last sound in chain (so far)
          rules[chain].push({
            sound: change,
            appears: rule.appears,
            note: rule.note,
          })
        } else {
          // Create a new rule object if no precedent is found.
          rules.push([
            { sound: from.join(''), disappears: rule.disappears },
            { sound: change, appears: rule.appears, note: rule.note },
          ])
        }
      }
    }
  }

  // Only return the active rules and the word as a string.
  return [rules.map(r => r.filter(x => notOutOfBounds(x, year))), word.join('')]
}

const getNumberOfVariants = (changes: PronunciationChange[][], year: number) =>
  changes
    .map(p => p.filter(r => notOutOfBounds(r, year)))
    .filter(s => s.length > 1).length

export { convertWordToLetters, getPronunciation, getNumberOfVariants }
