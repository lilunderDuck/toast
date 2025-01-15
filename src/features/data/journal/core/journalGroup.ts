import type { 
  IClientJournalGroupData,
  IJournalGroupData
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
  async $create(data: IJournalGroupData) {
    console.group('[journal group]\t\t Creating group')
    const journalGroupId = createId()
    const newData: IJournalGroupData = mergeObjects(data, {
      id: journalGroupId,
      created: new Date(),
      tree: [],
      entries: 0,
    } as Partial<IJournalGroupData>)
  
    const whereToCreate = buildJournalGroupPath(journalGroupId)
  
    await createDirectoryIfNotExist(whereToCreate)
    await journalGroupFs.$writeMetaFile(journalGroupId, newData)
    await groupLockCache.set(newData)
    await groupTreeCache.create(journalGroupId)

    console.groupEnd()
    return newData
  },

  async $update(journalGroupId: string, data: Partial<IJournalGroupData>) {
    console.group('[journal group]\t\t Updating group')
    const cache = await groupLockCache.getAll()
    const newData: IJournalGroupData = mergeObjects(cache[journalGroupId], data, {
      modified: new Date()
    })
    
    await journalGroupFs.$writeMetaFile(journalGroupId, () => newData)
    await groupLockCache.set(newData)
    if (data.tree) {
      await groupTreeCache.set(journalGroupId, undefined, data.tree)
    }

    console.groupEnd()
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