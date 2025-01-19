import type { 
  IJournalGroupData,
  JournalGroupSchema
} from "~/api/journal"
import { 
  isThisDirectoryExist
} from "~/server"
import { mergeObjects } from '~/common'
// ...
import { 
  buildJournalGroupPath,
  createId,
} from '../utils'
import { journalGroupCache, journalGroupFileHandler } from "../handlers"
import { journalGroupTreeCache } from "../cache"

export const journalGroupData = {
  async $create(data: JournalGroupSchema) {
    const groupId = createId()
    const newData: IJournalGroupData = mergeObjects(data, {
      id: groupId,
      created: new Date(),
      tree: [],
      entries: 0,
    } as Partial<IJournalGroupData>)
  
    await journalGroupFileHandler.create$(groupId)
    await journalGroupFileHandler.write$(groupId, newData)
    await journalGroupCache.set$(groupId, newData)
    await journalGroupTreeCache.create(groupId)

    return newData
  },

  async $update(groupId: string, data: Partial<IJournalGroupData>) {
    const cacheData = await journalGroupCache.get$(groupId)
    const newData: IJournalGroupData = mergeObjects(cacheData, data, {
      modified: new Date()
    })
    
    await journalGroupFileHandler.write$(groupId, () => newData)

    if (data.tree) {
      await journalGroupTreeCache.set(groupId, undefined, data.tree)
    }

    return newData
  },

  async $getAll() {
    return Object.values(await journalGroupCache.getAll$())
  },
  
  async $get(id: string) {
    const allData = await journalGroupCache.getAll$()
    const data = allData[id]
    return data
  },

  // await journalGroupCache.remove$(groupId)
  
  async $isExist(groupId: string) {
    const isExistInCache = !!(await journalGroupCache.get$(groupId))
    if (!isExistInCache) {
      return await isThisDirectoryExist(buildJournalGroupPath(groupId))
    }

    return isExistInCache
  }
}