import type { IJournalData, IJournalGroupData, JournalVituralFileTree } from "~/api/journal"
import { bson_readFile, bson_writeFile, CACHE_FOLDER, deleteFile } from "~/server"

export interface IJournalGroupLockFile {
  [groupId: string]: IJournalData
}

export interface ICachedJournalGroupContentFile {
  journals: Record<string, JournalVituralFileTree.Data>
  tree: IJournalGroupData["tree"]
}

const buildGroupCacheFileName = (groupId: string) => `${CACHE_FOLDER}/cached-${groupId}-data.dat` as const
export const groupTreeCache = {
  async create(groupId: string) {
    return bson_writeFile<ICachedJournalGroupContentFile>(buildGroupCacheFileName(groupId), {
      journals: {},
      tree: []
    })
  },
  async set(groupId: string, data?: IJournalData, tree?: IJournalGroupData["tree"]) {
    const prevData = await this.get(groupId) ?? {} as ICachedJournalGroupContentFile
    if (data) {
      prevData.journals[data.id] = data
    }

    if (tree) {
      prevData.tree = tree
    }

    await bson_writeFile(buildGroupCacheFileName(groupId), prevData)
  },
  async get(groupId: string) {
    return await bson_readFile<ICachedJournalGroupContentFile>(buildGroupCacheFileName(groupId))
  },
  async remove(groupId: string, journalId: string) {
    const prevData = (await this.get(groupId))!

    delete prevData.journals[journalId]

    await bson_writeFile(buildGroupCacheFileName(groupId), prevData)
  },
  async delete(groupId: string) {
    await deleteFile(buildGroupCacheFileName(groupId))
  }
}

const LOCK_FILE_NAME = `${CACHE_FOLDER}/groups.dat` as const
export const groupLockCache = {
  async getAll() {
    return await bson_readFile<IJournalGroupLockFile>(LOCK_FILE_NAME) ?? {}
  },
  async set(data: IJournalData) {
    const prevData = await this.getAll()
    prevData[data.id] = data
    await bson_writeFile(LOCK_FILE_NAME, prevData)
  },
  async remove(groupId: string) {
    const prevData = await this.getAll()
    delete prevData[groupId]
    await bson_writeFile(LOCK_FILE_NAME, prevData)
  }
}