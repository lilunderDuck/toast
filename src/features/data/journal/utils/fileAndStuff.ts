import { mergeObjects } from "~/common"

export interface IFileCompression<Data = any, CompressedData = any> {
  compress$(incomingData: Data): CompressedData
  decompress$(compressedData: CompressedData): Data
}

export interface IFileHandler {
  write$: AnyFunction
  read$: AnyFunction
  delete$: AnyFunction
}

/**A type alias representing a function that can either directly 
 * provide updated data or a function to update existing data.
 *
 * @template T The type of the data being updated.
 * @param prev The updated data or a function that takes the previous data and returns the updated data.
 * @returns The updated data.
 */
export type Updater<T> = T | ((prev: T) => Partial<T>)

export async function readAndUpdatePreviousIfNeeds<T, U extends AnyFunction>(
  newData: Updater<T>, 
  readFileFn: U, ...args: Parameters<U>
): Promise<T> {
  if (typeof newData !== "function") return newData
  const previous = await readFileFn(...args)
  // @ts-ignore
  const overritenData = mergeObjects(previous!, newData(previous!))
  return overritenData
}

export function createFileHandler<T extends IFileHandler>(fn: () => T) {
  return fn()
}