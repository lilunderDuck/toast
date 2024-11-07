export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
// ...

type Predicate<Value, Array> = (value: Value, index: number, obj: Array[]) => unknown

export function arrayObjects_find<T extends {}[]>(
  arrayOfObjects: T,
  whereToFind: Predicate<ArrayElement<T>, T>
): [ArrayElement<T>, number] {
  // @ts-ignore
  const index = arrayOfObjects.findIndex(whereToFind)
  return [arrayOfObjects[index] as ArrayElement<T>, index]
}

export function arrayObjects_replace<T extends {}[]>(
  arrayOfObjects: T, 
  whereToReplace: Predicate<ArrayElement<T>, T>, 
  somethingElse: ArrayElement<T>
) {
  const [oldData, index] = arrayObjects_find(arrayOfObjects, whereToReplace)
  console.log('old', oldData)

  const newData = {
    ...oldData,
    ...somethingElse,
  }

  console.log('new', newData)
  arrayOfObjects[index] = newData
  return arrayOfObjects
}

export function isEmptyObject(obj: {}) {
  return Object.keys(obj).length === 0;
}