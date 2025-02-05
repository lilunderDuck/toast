import type { IJournalData } from "client/api/journal"
import { bson_readFile, bson_writeFile, deleteFile } from "client/server"

export interface IJournalGroupLockFile {
  [groupId: string]: IJournalData
}

export interface ICache<T = any> {
  get$(key: string): Promise<T>
  set$(key: string, data: T): Promise<void>
  getAll$(): Promise<ICacheData<T>>
  remove$(key: string): Promise<void>
  delete$(): Promise<void>
}

interface ICacheData<AnyData = any> {
  [key: string]: AnyData
}

export async function createCacheStorage<T>(location: string, name: string): Promise<ICache<T>> {
  const path = `${location}/${name}.cached.dat`
  await bson_writeFile(path, {})

  return {
    async get$(key) {
      const dataInDisk = await bson_readFile<ICacheData>(path)
      return dataInDisk![key]
    },
    async set$(key, data) {
      const dataInDisk = (await bson_readFile<ICacheData>(path))!
      dataInDisk[key] = data
      await bson_writeFile(path, dataInDisk)
    },
    async getAll$() {
      return (await bson_readFile(path))!
    },
    async remove$(key) {
      const dataInDisk = (await bson_readFile<ICacheData>(path))!
      delete dataInDisk[key]
      await bson_writeFile(path, dataInDisk)
    },
    async delete$() {
      await deleteFile(path)
    },
  }
}