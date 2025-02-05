type BuiltObject<
  T extends (string | number)[], 
  V extends string | number
> = {
  [Key in T[number]]: V
}

export function buildObject<
  T extends string | number, 
  V extends string | number
>(keys: readonly T[], values: V[]): BuiltObject<T[], V> {
  const object = {}
  if (keys.length !== values.length) {
    console.error('keys and values must have the same length')
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i], value = values[i]
    // @ts-ignore
    object[key] = value
  }
  
  // @ts-ignore
  return object
}