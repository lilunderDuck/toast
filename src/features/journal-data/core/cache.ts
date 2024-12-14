import type { JournalApi } from "~/api/journal"
import { bson_readFile, bson_writeFile, CACHE_FOLDER } from "~/server"

type JournalGroupCacheData = Record<string, JournalApi.GroupData>

const FILE_NAME = `${CACHE_FOLDER}/groups.dat` as const
const FILE_TREE_NAME = (groupId: string) => `${CACHE_FOLDER}/tree-${groupId}.dat` as const
export async function getAllJournalGroupsCache() {
  return await bson_readFile<JournalGroupCacheData>(FILE_NAME) ?? {}
}

export async function updateJournalGroupsCache(data: JournalApi.GroupData) {
  const prevData = await getAllJournalGroupsCache()
  prevData[data.id] = data
  await bson_writeFile(FILE_NAME, prevData)
}

export async function updateFileTreeCache() {}