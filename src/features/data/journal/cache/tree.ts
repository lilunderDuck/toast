import type { 
  IClientJournalVirturalFileTreeData,
  IJournalGroupData, 
  JournalVituralFileTree 
} from "~/api/journal"
import { bson_readFile, bson_writeFile, CACHE_FOLDER, deleteFile, isThisDirectoryExist } from "~/server"
import { journalGroupFileHandler } from "../handlers"
import { getAllJournalData } from "../utils"

export interface ICachedJournalGroupContentFile extends IClientJournalVirturalFileTreeData {
  // ...
}

function buildGroupCacheFileName(groupId: string) {
  return `${CACHE_FOLDER}/cached-${groupId}-data.dat` as const
}

export const journalGroupTreeCache = {
  async create(groupId: string) {
    const thisGroupPath = buildGroupCacheFileName(groupId)
    if (await isThisDirectoryExist(thisGroupPath)) {
      return console.warn(groupId, 'already exist')
    }

    return bson_writeFile<ICachedJournalGroupContentFile>(thisGroupPath, {
      lookup: {},
      tree: []
    })
  },
  async set(groupId: string, data?: JournalVituralFileTree.Data, tree?: IJournalGroupData["tree"]) {
    const prevData = await this.get(groupId) ?? {} as ICachedJournalGroupContentFile
    if (data) {
      prevData.lookup[data.id] = data
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

    delete prevData.lookup[journalId]

    await bson_writeFile(buildGroupCacheFileName(groupId), prevData)
  },
  async delete(groupId: string) {
    await deleteFile(buildGroupCacheFileName(groupId))
  },
  async rebuild(groupId: string): Promise<void | IClientJournalVirturalFileTreeData> {
    const groupData = await journalGroupFileHandler.read$(groupId)
    if (!groupData) {
      return console.error('Could not find journal group data:', groupId)
    }

    await this.create(groupId)

    const tree = groupData.tree
    const allJournal = await getAllJournalData(groupId)

    const lookup: IClientJournalVirturalFileTreeData["lookup"] = {}
    for (const journal of allJournal) {
      lookup[journal.id] = journal
      await this.set(groupId, journal)
    }

    await this.set(groupId, undefined, tree)

    return { lookup, tree }
  }
}