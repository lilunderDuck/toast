import type { ArrayElement } from "./structs"

/**Generates a random number between 0 and the specified `bound`.
 *
 * @param bound
 * @returns A random number
 */
export function getRandomNumber(bound: number) {
  return Math.floor(Math.random() * bound)
}

export function getRandomNumberFrom(from: number, to: number) {
  const minCeiled = Math.ceil(from)
  const maxFloored = Math.floor(to)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

/**Selects a random element from an array.
 *
 * @template T The type of the elements in the array.
 * @param fromArray The array to select from.
 * @returns A random element from the array.
 */
export function getRandomElement<T extends any[]>(fromArray: T): ArrayElement<T> {
  return fromArray[getRandomNumber(fromArray.length)]
}


/**Generate a sub-optimial random string within a specified `length`.
 * @see https://stackoverflow.com/a/1349426
 * @see https://stackoverflow.com/questions/1349404/generate-a-string-of-random-characters
*/
export function makeId(length: number) {
  const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (var i = 0; i < length; i++) {
    result += CHARACTERS.charAt(getRandomNumber(CHARACTERS.length));
  }
  return result
}