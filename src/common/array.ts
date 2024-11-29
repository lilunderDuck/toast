/**Extracts the element type of an array.
 * @template ArrayType The type of the array.
 * @returns The element type of the array.
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
// ...

/**Defines a predicate function type for filtering or finding elements in an array.
 * @template Value  The type of the elements in the array.
 * @template Array  The type of the array.
 * @param value     The current element being processed.
 * @param index     The index of the current element.
 * @param obj       The entire array.
 * @returns A boolean value indicating whether the element should be included or matched.
 */
type Predicate<Value, Array> = (value: Value, index: number, obj: Array[]) => unknown

export interface IThisArrayObjects<T extends AnyObject[]> {
  /**Removes an object from the array based on a property name and value.
   *
   * @template Element The type of the property to filter by.
   * @param name     The name of the property to filter by.
   * @param value    The value of the property to filter by.
   * @returns A new array with the specified object removed.
   */
  $remove<Element extends keyof ArrayElement<T>>(
    name: Element, value: ArrayElement<T>[Element]
  ): T
  /**Replaces an object in the array with a new one based on a predicate.
   * @param whereToReplace   The predicate function to find the object to replace.
   * @param somethingElse    The new object to replace the old one with.
   * @returns The modified array.
   */
  $replace(
    whereToReplace: Predicate<ArrayElement<T>, T>, 
    somethingElse: Partial<ArrayElement<T>>
  ): T
  /**Finds an object in the array based on a predicate.
   * @param whereToFind The predicate function to find the object.
   * @returns An array containing the found object and its index.
   */
  $find(whereToFind: Predicate<ArrayElement<T>, T>): [ArrayElement<T>, number]
}

/**Provides some utility functions for working with arrays of objects.
 * 
 * Seriously, why it's missing a few useful method...
 *
 * @template T The type of the array of objects.
 * @param arrayOfObjects The array of objects to operate on.
 */
export function thisArrayObjects<T extends AnyObject[]>(arrayOfObjects: T): IThisArrayObjects<T> {
  return {
    $remove(name, value) {
      // @ts-ignore
      return arrayOfObjects.filter((it) => it[name] !== value) as T
      //                                   ^^^^^^^^
      // well, the type error is right here - [look at the arrow]
      // but the code is working fineee...
    },
    $replace(whereToReplace, somethingElse) {
      const [oldData, index] = this.$find(whereToReplace)
      console.log('old', oldData)

      const newData = {
        ...oldData,
        ...somethingElse,
      }

      console.log('new', newData)
      arrayOfObjects[index] = newData
      return arrayOfObjects
    },
    $find(whereToFind) {
      // @ts-ignore
      const index = arrayOfObjects.findIndex(whereToFind)
      return [arrayOfObjects[index] as ArrayElement<T>, index]
    }
  }
}

/**Checks if an object is empty.
 *
 * @param obj any object to check.
 * @returns `true` if the object is empty, `false` otherwise.
 */
export function isEmptyObject(obj: {}) {
  return Object.keys(obj).length === 0;
}