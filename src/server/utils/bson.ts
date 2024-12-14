import { BSON } from "bson"
import { writeFile, readFile } from './fs'

export async function bson_writeFile<T extends {}>(somePath: string, someData: T) {
  console.group("[bson] Writing", somePath)
  const encoded = BSON.serialize(someData)
  const buff = Buffer.from(encoded)
  await writeFile(somePath, buff)
  console.groupEnd()
}

export async function bson_readFile<T>(somePath: string): Promise<T | null> {
  console.group("[bson] Reading", somePath)
  const dataOnDisk = await readFile(somePath) as Buffer
  if (!dataOnDisk) {
    console.groupEnd()
    return dataOnDisk // returns null
  }

  const buff = Buffer.from(dataOnDisk)

  console.groupEnd()
  return BSON.deserialize(
    Uint8Array.from(buff)
  ) as T
}