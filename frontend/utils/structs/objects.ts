export function isObject(someValue: any): someValue is object {
  return toString.call(someValue) === '[object Object]'
}