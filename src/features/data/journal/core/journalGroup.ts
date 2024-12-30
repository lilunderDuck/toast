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
  journalGroupCache,
  createId
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
    await journalGroupCache.write(journalGroupId, newData)
    return newData
  },

  async $update(journalGroupId: string, data: Partial<JournalApi.IGroupData>) {
    const cache = await journalGroupCache.getAll()
    const newData: JournalApi.IGroupData = mergeObjects(cache[journalGroupId], data, {
      modified: new Date()
    })
    
    await journalGroupFs.$writeMetaFile(journalGroupId, () => newData)
    await journalGroupCache.write(data.id!, newData)
    return newData
  },

  async $getAll() {
    return Object.values(await journalGroupCache.getAll())
  },
  
  async $get(id: string) {
    return (await journalGroupCache.getAll())[id]
  },
  
  $isExist(journalGroupId: string) {
    return isThisDirectoryExist(buildJournalGroupPath(journalGroupId))
  }
}