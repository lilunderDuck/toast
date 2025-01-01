import { 
  IClientJournalGroupData,
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
  groupLockCache,
  createId,
  groupTreeCache
} from '../utils'

export const journalGroupData = {
  async $create(data: JournalApi.Group) {
    const journalGroupId = createId()
    const newData: JournalApi.IGroupData = mergeObjects(data, {
      id: journalGroupId,
      created: new Date(),
      tree: [],
      entries: 0,
    } as Partial<JournalApi.IGroupData>)
  
    const whereToCreate = buildJournalGroupPath(journalGroupId)
  
    await createDirectoryIfNotExist(whereToCreate)
    await journalGroupFs.$writeMetaFile(journalGroupId, newData)
    await groupLockCache.set(newData)
    return newData
  },

  async $update(journalGroupId: string, data: Partial<JournalApi.IGroupData>) {
    const cache = await groupLockCache.getAll()
    const newData: JournalApi.IGroupData = mergeObjects(cache[journalGroupId], data, {
      modified: new Date()
    })
    
    await journalGroupFs.$writeMetaFile(journalGroupId, () => newData)
    await groupLockCache.set(newData)
    return newData
  },

  async $getAll() {
    return Object.values(await groupLockCache.getAll())
  },
  
  async $get(id: string) {
    const data = (await groupLockCache.getAll())[id] as IClientJournalGroupData
    data.treeMapping = (await groupTreeCache.get(id))!.journals
    return data
  },
  
  $isExist(journalGroupId: string) {
    return isThisDirectoryExist(buildJournalGroupPath(journalGroupId))
  }
}