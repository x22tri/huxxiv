import { PhoneticVariant } from '../types'

import { RULES } from '../database/RULES'

const alwaysShown = 'Mindig látható'
const notReachedYet = 'Még nincs elérve'
const gonePast = 'Meghaladva'
const appearanceInProgress = 'Újonnan megjelenő elem'
const disappearanceInProgress = 'Eltűnő elem'
const concurrentVariants = 'Egyenértékű változatok'

const getPronunciation = (
  phonemic: (string | PhoneticVariant)[][],
  handleAppear: (rule: object) => string
): { pron: string[]; numberOfVariants: number }[] => {
  const changedPronunciation: (string | PhoneticVariant)[][] = JSON.parse(
    JSON.stringify(phonemic)
  )

  changedPronunciation.forEach(phonemicVariant => {
    RULES.forEach(rule => {
      phonemicVariant.forEach((phoneme, index) => {
        if (rule.target === phoneme && rule.change) {
          switch (handleAppear(rule)) {
            case appearanceInProgress:
              phonemicVariant[index] = {
                main: rule.target,
                new: rule.change,
                appears: rule.appears,
              }
              // !actRules.includes(rule) && actRules.push(rule)
              break
            case notReachedYet:
              phonemicVariant[index] = rule.target
              // actRules.includes(rule) && actRules.splice(actRules.indexOf(rule))
              break
            case gonePast:
              phonemicVariant[index] = rule.change
              // actRules.includes(rule) && actRules.splice(actRules.indexOf(rule))
              break
            case disappearanceInProgress:
              phonemicVariant[index] = {
                main: rule.change,
                old: rule.target,
                disappears: rule.disappears,
              }
              // !actRules.includes(rule) && actRules.push(rule)
              break
          }
        }
      })
    })
  })

  return changedPronunciation.map(phonemicVariant => ({
    pron: phonemicVariant.map(phoneme =>
      typeof phoneme === 'string' ? phoneme : phoneme.main
    ),
    numberOfVariants: phonemicVariant.filter(
      phoneme => typeof phoneme === 'object'
    ).length,
  }))
  // actRules, To-Do!!!
}

export default getPronunciation

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
