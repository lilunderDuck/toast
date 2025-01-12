import { Buffer } from 'node:buffer'
import { BSON } from "bson"
// ...
import { writeFile, readFile } from './fs'

const cache = new Map()
export async function bson_writeFile<T extends {}>(somePath: string, someData: T) {
  console.log("[bson]\t\t writing", somePath, 'with', JSON.stringify(someData))
  await writeFile(somePath, bson_serialize(someData))

  console.log("[bson]\t\t cached data saved")
  cache.set(somePath, someData)
}

export async function bson_readFile<T>(somePath: string): Promise<T | null> {
  console.log("[bson]\t\t reading", somePath)
  // check if we already saved the data in memory, if so, just return it.
  const cachedData = cache.get(somePath)
  if (cachedData) {
    console.log("[bson]\t\t data read from cache", cachedData)
    return cachedData
  }

  // if we don't then just read from disk.
  // returns "null" if it cannot find "somePath"
  const dataOnDisk = await readFile(somePath) as Buffer
  if (!dataOnDisk) {
    return dataOnDisk // returns null
  }
  
  // dealing with some deserialization because we're reading binary JSON
  const json = bson_deserialize(dataOnDisk) as T
  console.log("[bson]\t\t data", JSON.stringify(json))

  // make sure to save to cache too, for faster read operation
  cache.set(somePath, json)
  return json
}

export function bson_serialize(someData: object) {
  const encoded = BSON.serialize(someData)
  return Buffer.from(encoded)
}

export function bson_deserialize(binaryJsonData: Buffer) {
  const buff = Buffer.from(binaryJsonData)
  return BSON.deserialize(
    Uint8Array.from(buff)
  )
}