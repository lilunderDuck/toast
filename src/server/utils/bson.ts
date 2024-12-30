import { BSON } from "bson"
import { writeFile, readFile } from './fs'

export async function bson_writeFile<T extends {}>(somePath: string, someData: T) {
  console.log("[bson]\t\t Writing", somePath, 'with', JSON.stringify(someData))
  const encoded = BSON.serialize(someData)
  const buff = Buffer.from(encoded)
  await writeFile(somePath, buff)
}

export async function bson_readFile<T>(somePath: string): Promise<T | null> {
  console.log("[bson]\t\t Reading", somePath)
  const dataOnDisk = await readFile(somePath) as Buffer
  if (!dataOnDisk) {
    return dataOnDisk // returns null
  }

  const buff = Buffer.from(dataOnDisk)

  return BSON.deserialize(
    Uint8Array.from(buff)
  ) as T
}