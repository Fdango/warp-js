import isArray from 'lodash/isArray'
import keys from 'lodash/keys'

/**
 * A custom recursive "merge" implementation. While this could be
 * swapped out with similar functions from jQuery, underscore,
 * lodash etc, this function allows for custom error handling
 * to be plugged in at each level as per the previous example.
 *
 * @param  {object}      target
 * @param  {object}      source
 * @param  {function}    [errorHandler=null]
 * @return {object}
 */

export const mergeObject = (source, target, errorHandler) => {
  let sourceKeys = []

  if (!target || typeof target !== 'object') {
    throw new TypeError('Target must be a valid object')
  }

  if (isArray(source)) {
    for (let i = 0; i < source.length; i++) {
      sourceKeys.push(i)
    }
  } else if (source) {
    sourceKeys = keys(source)
  }

  // Iterate through all keys of the source object

  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i]
    const descriptor = Object.getOwnPropertyDescriptor(source, key)

    // Skip non-enumerable getters

    if (typeof descriptor.get === 'function' && !descriptor.enumerable) continue

    if (typeof source[key] !== 'object' || source[key] === null) {
      // All non-object primitives or nulls

      try {
        target[key] = source[key]
      } catch (err) {
        // Catch and handle assignment errors

        if (typeof errorHandler !== 'function') throw err

        errorHandler(err, target)
      }
    } else if (Array.isArray(source[key])) {
      // Arrays

      if (!target[key]) {
        target[key] = []
      }

      mergeObject(target[key], source[key], errorHandler)
    } else {
      // Objects

      if (!target[key]) {
        target[key] = {}
      }

      mergeObject(target[key], source[key], errorHandler)
    }
  }

  return target
}
