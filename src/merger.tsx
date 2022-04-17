import { LaterDevelopments, Word, WordUse } from './CHARS'

interface WordState extends Word {
  latestUpdate: number
}

interface IIsObject {
  (item: any): boolean
}

interface IObject {
  [key: string]: any
}

interface IDeepMerge {
  (target: IObject, source: IObject): IObject
}

/**
 * @description Method to check if an item is an object. Date and Function are considered
 * an object, so if you need to exclude those, please update the method accordingly.
 * @param item - The item that needs to be checked
 * @return {Boolean} Whether or not @item is an object
 */
export const isObject: IIsObject = (item: any): boolean => {
  return item === Object(item) && !Array.isArray(item)
}

/**
 * @description Method to perform a deep merge of objects.
 * @param {Object} target - The targeted object that needs to be merged with the supplied source.
 * @param {Object} source - The source that will be used to update the target object.
 * @return {Object} The final merged object.
 */
export const merger: IDeepMerge = (
  target: IObject,
  source: IObject
): IObject => {
  const result: IObject = target

  if (isObject(result)) {
    //   const len: number = sources.length;

    //   for (let i = 0; i < len; i += 1) {
    // const source: any = sources[i];

    if (isObject(source)) {
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          if (isObject(source[key])) {
            if (!result[key] || !isObject(result[key])) {
              result[key] = {}
            }
            merger(result[key], source[key])
          } else {
            if (Array.isArray(result[key]) && Array.isArray(source[key])) {
              // concatenate the two arrays and remove any duplicate primitive values
              result[key] = Array.from(new Set(result[key].concat(source[key])))
            } else {
              result[key] = source[key]
            }
          }
        }
      }
      // }
    }
  }

  return target
}

export default merger
