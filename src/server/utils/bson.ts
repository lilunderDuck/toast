import { BSON } from "bson"
import { writeFile, readFile } from './fs'

const cache = new Map()
export async function bson_writeFile<T extends {}>(somePath: string, someData: T) {
  console.log("[bson]\t\t writing", somePath, 'with', JSON.stringify(someData))
  const encoded = BSON.serialize(someData)
  const buff = Buffer.from(encoded)
  await writeFile(somePath, buff)

  console.log("[bson]\t\t cached data saved")
  cache.set(somePath, someData)
}

export async function bson_readFile<T>(somePath: string): Promise<T | null> {
  console.log("[bson]\t\t reading", somePath)
  const cachedData = cache.get(somePath)
  if (cachedData) {
    console.log("[bson]\t\t data read from cache", cachedData)
    return cachedData
  }

  const dataOnDisk = await readFile(somePath) as Buffer
  if (!dataOnDisk) {
    return dataOnDisk // returns null
  }

  const buff = Buffer.from(dataOnDisk)
  const json = BSON.deserialize(
    Uint8Array.from(buff)
  ) as T

  console.log("[bson]\t\t data", JSON.stringify(json))
  cache.set(somePath, json)
  return json
}