import { IJournalData, IJournalGroupData, JournalVituralFileTree } from "~/api/journal"
import { bson_readFile, bson_writeFile, CACHE_FOLDER, deleteFile } from "~/server"

export interface ICachedJournalGroupContentFile {
  journals: Record<string, JournalVituralFileTree.Data>
  tree: IJournalGroupData["tree"]
}

function buildGroupCacheFileName(groupId: string) {
  return `${CACHE_FOLDER}/cached-${groupId}-data.dat` as const
}

export const journalGroupTreeCache = {
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