import type { JournalApi } from "~/api/journal"
import { bson_readFile, bson_writeFile, CACHE_FOLDER, deleteFile } from "~/server"
import { Updater } from "./journal"
import { mergeObjects } from "~/common"

const LOCK_FILE_NAME = `${CACHE_FOLDER}/groups.dat` as const
const buildGroupCacheFileName = (groupId: string) => `${CACHE_FOLDER}/cached-${groupId}-data.dat` as const

export interface IJournalGroupLockFile {
  [groupId: string]: JournalApi.IGroupData
}

export interface ICachedJournalGroupContentFile extends JournalApi.IGroupData {
  journals?: Record<string, JournalApi.Files>
}

export const journalGroupCache = {
  async getAll() {
    return await bson_readFile<IJournalGroupLockFile>(LOCK_FILE_NAME) ?? {}
  },
  async write(groupId: string, data: Updater<ICachedJournalGroupContentFile>) {
    const isUpdater = typeof data === "function"
    let newData = data as ICachedJournalGroupContentFile
    if (isUpdater) {
      const prev = await bson_readFile<ICachedJournalGroupContentFile>(buildGroupCacheFileName(groupId))
      newData = mergeObjects(prev!, data(prev!))
    }
    await bson_writeFile(buildGroupCacheFileName(groupId), newData)

    const prevData = await this.getAll()
    prevData[groupId] = newData
    await bson_writeFile(LOCK_FILE_NAME, prevData)
  },
  async remove(groupId: string) {
    await deleteFile(buildGroupCacheFileName(groupId))
    const prevData = await this.getAll()
    delete prevData[groupId]
    await bson_writeFile(LOCK_FILE_NAME, prevData)
  }
}