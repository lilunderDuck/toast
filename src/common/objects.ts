export function mergeObjects<T extends object[]>(...things: T) {
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