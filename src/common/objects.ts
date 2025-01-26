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