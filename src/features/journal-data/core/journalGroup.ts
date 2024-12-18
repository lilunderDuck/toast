import crypto from 'node:crypto'
// ...
import { 
  type JournalApi
} from "~/api/journal"
import { 
  createDirectoryIfNotExist, 
  isThisDirectoryExist
} from "~/server"
import { mergeObjects } from '~/common'
// ...
import { 
  buildJournalGroupPath, 
  journalGroupFs,
  getAllJournalGroupsCache,
  updateJournalGroupsCache, 
  createId
} from '../utils'

export const journalGroupData = {
  async $create(data: JournalApi.Group) {
    const journalGroupId = createId()
    const newData: JournalApi.IGroupData = mergeObjects(data, {
      id: journalGroupId,
      created: new Date(),
      tree: {}
    } as JournalApi.IGroupData)
  
    const whereToCreate = buildJournalGroupPath(journalGroupId)
  
    await createDirectoryIfNotExist(whereToCreate)
    await journalGroupFs.$writeMetaFile(journalGroupId, newData)
    await updateJournalGroupsCache(newData)
    return newData
  },

  async $update(journalGroupId: string, data: Partial<JournalApi.IGroupData>) {
    const cache = await getAllJournalGroupsCache()
    const newData: JournalApi.IGroupData = mergeObjects(cache[journalGroupId], data, {
      modified: new Date()
    })
    
    await journalGroupFs.$writeMetaFile(journalGroupId, () => newData)
    await updateJournalGroupsCache(newData)
    return newData
  },

  async $getAll() {
    return Object.values(await getAllJournalGroupsCache())
  },
  
  async $get(id: string) {
    return (await getAllJournalGroupsCache())[id]
  },
  
  $isExist(journalGroupId: string) {
    return isThisDirectoryExist(buildJournalGroupPath(journalGroupId))
  }
}