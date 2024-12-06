import { ArrayElement } from "./array"

/**Generates a random number between 0 and the specified `bound`.
 *
 * @param bound
 * @returns A random number
 */
export function getRandomNumber(bound: number) {
  return Math.floor(Math.random() * bound)
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