import { Word, Keyword } from '../database/CHARSV2'

// const graphPhonemeDictionary = [
//   { a: 'ɒ' },
//   { á: 'aː' },
//   { b: 'b' },
//   { c: 't͡s' },
//   { cs: 't͡ʃ' },
//   { d: 'd' },
//   { dz: 'd͡z' },
//   { dzs: 'd͡ʒ' },
//   { e: 'ɛ' },
//   { é: 'eː' },
//   { f: 'f' },
//   { g: 'g' },
//   { gy: 'ɟ' },
//   { h: 'h' },
//   { i: 'i' },
//   { í: 'iː' },
//   { j: 'j' },
//   { k: 'k' },
//   { l: 'l' },
//   { ly: 'j' },
//   { m: 'm' },
//   { n: 'n' },
//   { ny: 'ɲ' },
//   { o: 'o' },
//   { ó: 'oː' },
//   { ö: 'ø' },
//   { ő: 'øː' },
//   { p: 'p' },
//   { q: 'kv' },
//   { r: 'r' },
//   { s: 'ʃ' },
//   { sz: 's' },
//   { t: 't' },
//   { ty: 'c' },
//   { u: 'u' },
//   { ú: 'uː' },
//   { ü: 'y' },
//   { ű: 'yː' },
//   { v: 'v' },
//   { z: 'z' },
//   { zs: 'ʒ' },
// ]

const graphPhonemeDictionary = [
  ['a', 'ɒ'],
  ['á', 'aː'],
  ['b', 'b'],
  ['c', 't͡s'],
  ['cs', 't͡ʃ'],
  ['d', 'd'],
  ['dz', 'd͡z'],
  ['dzs', 'd͡ʒ'],
  ['e', 'ɛ'],
  ['é', 'eː'],
  ['f', 'f'],
  ['g', 'g'],
  ['gy', 'ɟ'],
  ['h', 'h'],
  ['i', 'i'],
  ['í', 'iː'],
  ['j', 'j'],
  ['k', 'k'],
  ['l', 'l'],
  ['ly', 'j'],
  ['m', 'm'],
  ['n', 'n'],
  ['ny', 'ɲ'],
  ['o', 'o'],
  ['ó', 'oː'],
  ['ö', 'ø'],
  ['ő', 'øː'],
  ['p', 'p'],
  ['q', 'kv'],
  ['r', 'r'],
  ['s', 'ʃ'],
  ['sz', 's'],
  ['t', 't'],
  ['ty', 'c'],
  ['u', 'u'],
  ['ú', 'uː'],
  ['ü', 'y'],
  ['ű', 'yː'],
  ['v', 'v'],
  ['z', 'z'],
  ['zs', 'ʒ'],
]

// let graphPhonemeDictionary = new Map()
// graphPhonemeDictionary.set('a', 'ɒ')
// graphPhonemeDictionary.set('á', 'aː')
// graphPhonemeDictionary.set('b', 'b')
// graphPhonemeDictionary.set('c', 't͡s')
// graphPhonemeDictionary.set('cs', 't͡ʃ')
// graphPhonemeDictionary.set('d', 'd')
// graphPhonemeDictionary.set('dz', 'd͡z')
// graphPhonemeDictionary.set('dzs', 'd͡ʒ')
// graphPhonemeDictionary.set('e', 'ɛ')
// graphPhonemeDictionary.set('é', 'eː')
// graphPhonemeDictionary.set('f', 'f')
// graphPhonemeDictionary.set('g', 'g')
// graphPhonemeDictionary.set('gy', 'ɟ')
// graphPhonemeDictionary.set('h', 'h')
// graphPhonemeDictionary.set('i', 'i')
// graphPhonemeDictionary.set('í', 'iː')
// graphPhonemeDictionary.set('j', 'j')
// graphPhonemeDictionary.set('k', 'k')
// graphPhonemeDictionary.set('l', 'l')
// graphPhonemeDictionary.set('ly', 'j')
// graphPhonemeDictionary.set('m', 'm')
// graphPhonemeDictionary.set('n', 'n')
// graphPhonemeDictionary.set('ny', 'ɲ')
// graphPhonemeDictionary.set('o', 'o')
// graphPhonemeDictionary.set('ó', 'oː')
// graphPhonemeDictionary.set('ö', 'ø')
// graphPhonemeDictionary.set('ő', 'øː')
// graphPhonemeDictionary.set('p', 'p')
// graphPhonemeDictionary.set('q', 'kv')
// graphPhonemeDictionary.set('r', 'r')
// graphPhonemeDictionary.set('s', 'ʃ')
// graphPhonemeDictionary.set('sz', 's')
// graphPhonemeDictionary.set('t', 't')
// graphPhonemeDictionary.set('ty', 'c')
// graphPhonemeDictionary.set('u', 'u')
// graphPhonemeDictionary.set('ú', 'uː')
// graphPhonemeDictionary.set('ü', 'y')
// graphPhonemeDictionary.set('ű', 'yː')
// graphPhonemeDictionary.set('v', 'v')
// graphPhonemeDictionary.set('z', 'z')
// graphPhonemeDictionary.set('zs', 'ʒ')

const convertKeywordToPhonemes = (keyword: string): string => {
  const lettersSortedByLength = graphPhonemeDictionary
    .map(i => i[0])
    .sort()
    .reverse()

  const keywordBreakdownToLetters = keyword.match(
    new RegExp(lettersSortedByLength.join('|'), 'gi')
  )

  let phonemeArray: string[] = []

  keywordBreakdownToLetters?.forEach(letter => {
    let phoneme = graphPhonemeDictionary.find(i => i[0] === letter)
    if (phoneme) phonemeArray.push(phoneme[1])
  })

  return phonemeArray.join('')
}

// interface WordState extends Word {
//   pronunciation: string
// }

const convertCharToState = (word: Word) => {
  word.data = word.data.map(element => {
    if (!('word' in element)) return element
    else
      return {
        ...element,
        pronunciation: convertKeywordToPhonemes(element.word),
      }
  })

  return word.data
}

export default convertCharToState
