export function mergeObjects<T extends (object | undefined)[]>(...things: T) {
  return Object.assign({}, ...things)
}

/**Checks if an object is empty.
 *
 * @param obj any object to check.
 * @returns `true` if the object is empty, `false` otherwise.
 */
export function isEmptyObject(obj: {}) {
  return Object.keys(obj).length === 0;
}

export function convertMapToObject(anyMap: Map<any, any>) {
  return Object.fromEntries(anyMap)
}

export function convertObjectToMap(anyObject: {}) {
  return new Map(Object.entries(anyObject))
}

export function renamePropDeep<T extends Record<string, any>>(targetObject: T, renameMap: Record<keyof T, string>) {
  let renameLookup = new Map(Object.entries(renameMap))

  function rename(obj: T): T {
    if (Array.isArray(obj)) {
      return obj.map(rename)
    }

    if (typeof obj === "object" && obj !== null) {
      const newObj = {}
      for (const oldLabel in obj) {
        const newLabel = renameLookup.get(oldLabel) || oldLabel
        newObj[newLabel] = rename(obj[oldLabel])
      }

      return newObj
    }

    return obj
  }

  return rename(targetObject)
}