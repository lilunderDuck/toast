/**Extracts the element type of an array.
 * @template ArrayType The type of the array.
 * @returns The element type of the array.
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
// ...

/**Defines a predicate function type for filtering or finding elements in an array.
 * @template Value      The type of the elements in the array.
 * @template ArrayType  The type of the array.
 * @param value         The current element being processed.
 * @param index         The index of the current element.
 * @param obj           The entire array.
 * @returns A boolean value indicating whether the element should be included or matched.
 */
type Predicate<Value, ArrayType> = (value: Value, index: number, obj: ArrayType[]) => unknown

export interface IArrayObjectsUtils<T extends AnyObject[]> {
  /**Removes an object from the array based on a property name and value.
   *
   * @template Element The type of the property to filter by.
   * @param name     The name of the property to filter by.
   * @param value    The value of the property to filter by.
   * @returns A new array with the specified object removed.
   */
  remove$<Element extends keyof ArrayElement<T>>(
    name: Element, value: ArrayElement<T>[Element]
  ): T
  /**Removes an object from the array based on its index.
   *
   * @template Element The type of the property to filter by.
   * @param index
   * @returns A new array with the specified object removed.
   */
  removeByIndex$(index: number): T
  /**Replaces an object in the array with a new one based on a predicate.
   * 
   * @note the old value will be merged with the new value.
   * @param whereToReplace   The predicate function to find the object to replace.
   * @param somethingElse    The new object to replace the old one with.
   * @returns The modified array.
   */
  replace$(
    whereToReplace: Predicate<ArrayElement<T>, T>, 
    somethingElse: Partial<ArrayElement<T>>
  ): T
  /**Finds an object in the array based on a predicate.
   * @param whereToFind The predicate function to find the object.
   * @returns An array containing the found object and its index.
   */
  find$(whereToFind: Predicate<ArrayElement<T>, T>): [ArrayElement<T>, number]
}

/**Provides some utility functions for working with arrays of objects.
 * 
 * Seriously, why it's missing a few useful method...
 *
 * @template T The type of the array of objects.
 * @param arrayOfObjects The array of objects to operate on.
 */
export function arrayObjects<T extends AnyObject[]>(arrayOfObjects: T): IArrayObjectsUtils<T> {
  return {
    remove$(name, value) {
      // @ts-ignore - it does work
      return arrayOfObjects.filter((it) => it[name] !== value) as T
      //                                   ^^^^^^^^ the type error is here
    },
    removeByIndex$(index) {
      arrayOfObjects.splice(index, 1);
      return arrayOfObjects
    },
    replace$(whereToReplace, somethingElse) {
      const [oldData, index] = this.find$(whereToReplace)

      arrayOfObjects[index] = {
        ...oldData,
        ...somethingElse,
      } // assign to a new value

      return arrayOfObjects
    },
    find$(whereToFind) {
      // @ts-ignore
      const index = arrayOfObjects.findIndex(whereToFind)
      return [arrayOfObjects[index] as ArrayElement<T>, index]
    }
  }
}

export function arrayInsert<T>(array: T[], index: number, ...items: T[]) {
  array.splice(index + 1, 0, ...items)
}