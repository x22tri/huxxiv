import { Changeable } from '../types'

const appearanceStatus = new Map([
  ['alwaysShown', 'Mindig látható'],
  ['notReachedYet', 'Még nincs elérve'],
  ['gonePast', 'Meghaladva'],
  ['appearanceInProgress', 'Újonnan megjelenő elem'],
  ['disappearanceInProgress', 'Eltűnő elem'],
  ['concurrentVariants', 'Egyenértékű változatok'],
])

// The function that shows the status of an element based on the current year.
// It is used to make obsolete elements disappear and new elements appear.
const handleAppear = (dataObject: Changeable, currentYear: number) =>
  !dataObject.appears && !dataObject.disappears
    ? 'alwaysShown'
    : dataObject.appears && dataObject.appears[0] > currentYear
    ? 'notReachedYet'
    : dataObject.appears && dataObject.appears[1] > currentYear
    ? 'appearanceInProgress'
    : dataObject.disappears && dataObject.disappears[1] < currentYear
    ? 'gonePast'
    : dataObject.disappears && dataObject.disappears[0] < currentYear
    ? 'disappearanceInProgress'
    : 'concurrentVariants'

// An auxiliary function that calls handleAppear and returns true if the element is always shown or currently active,
// and false otherwise.
const notOutOfBounds = (dataObject: Changeable, currentYear: number): boolean =>
  handleAppear(dataObject, currentYear) !== 'notReachedYet' &&
  handleAppear(dataObject, currentYear) !== 'gonePast'

const calculateOpacity = (
  dataObject: Changeable,
  currentYear: number
): number | undefined => {
  if (!dataObject.appears && !dataObject.disappears) return 1
  else {
    const minimumOpacity = 0.2
    const type = dataObject.appears ?? dataObject.disappears

    const calculatorFunc = (start: number, end: number): number =>
      (currentYear - start) / (end - start)

    const clamp = (num: number, min: number, max: number, rev: boolean) => {
      const result = !rev ? num : 1 - num
      return result <= min ? min : result >= max ? max : result
    }

    if (!type) throw new Error('Hiba: a beérkező adat rossz szerkezetű.')
    else
      return clamp(
        calculatorFunc(type[0], type[1]),
        minimumOpacity,
        1,
        type === dataObject.disappears
      )
  }
}

export { appearanceStatus, handleAppear, notOutOfBounds, calculateOpacity }
