// This code was adapted from https://gist.github.com/mir4ef/c172583bdb968951d9e57fb50d44c3f7

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
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (isObject(source[key])) {
          if (!target[key] || !isObject(target[key])) {
            target[key] = {}
          }
          merger(target[key], source[key])
        } else {
          if (Array.isArray(target[key]) && Array.isArray(source[key])) {
            // Concatenate the two arrays.
            // In arrays of objects with 'arrayNameId' properties, these id's are used to update or remove elements.
            const attributeId = `${key}Id`

            // If the new development pertains to an element already present in the word entry, merge the two objects.
            // If it's a development with a brand new attributeId, add it to the array.
            source[key].forEach((development: any) => {
              const alreadyPresent = target[key].find(
                (elem: any) => elem[attributeId] === development[attributeId]
              )

              alreadyPresent
                ? merger(alreadyPresent, development)
                : target[key].push(development)
            })
          } else {
            target[key] = source[key]
          }
        }
      }
    }
  }

  return target
}

export default merger
