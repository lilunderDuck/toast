import { readFile, writeFile } from "./fs"
import { internalCache } from "../internals"

const json_key = (path: string) => `json-${path}` as const

export async function json_readFile<
  T extends {}, 
  const Path extends string = string
>(somePath: Path): Promise<T | null> {
  const key = json_key(somePath)
  if (internalCache.has(key)) {
    return internalCache.get(key)
  }

  const dataOnDisk = await readFile(somePath, {
    encoding: 'utf-8'
  }) as string | null

  if (!dataOnDisk) {
    return null
  }

  return JSON.parse(dataOnDisk)
}

export async function json_writeFile<
  T extends {}, 
  const Path extends string = string
>(somePath: Path, someData: T) {
  const dataToWrite = __devMode ? 
    JSON.stringify(someData, null, 2) :  // -> format saved json data on dev mode
    JSON.stringify(someData)             // -> just stringify the json on production mode
  // ...
  await writeFile(somePath, dataToWrite)

  internalCache.set(json_key(somePath), someData)
}