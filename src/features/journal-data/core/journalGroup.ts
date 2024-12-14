import crypto from 'node:crypto'
// ...
import { 
  type JournalApi
} from "~/api/journal"
import { 
  bson_writeFile,
  createDirectoryIfNotExist, 
  isThisDirectoryExist
} from "~/server"
// ...
import { 
  getAllJournalGroupsCache,
  updateJournalGroupsCache 
} from './cache'
import { buildJournalGroupPath } from '../utils'
import { mergeObjects } from '~/common'

const META_FILE_NAME = `meta.dat`

export const journalGroupData = {
  async $create(data: JournalApi.Group) {
    const journalGroupId = crypto.randomBytes(5).toString('hex')
    const newData: JournalApi.GroupData = mergeObjects(data, {
      id: journalGroupId,
      created: new Date(),
      entries: 0
    })
  
    const whereToCreate = buildJournalGroupPath(journalGroupId)
  
    await createDirectoryIfNotExist(whereToCreate)
    await bson_writeFile(`${whereToCreate}/${META_FILE_NAME}`, newData)
    await updateJournalGroupsCache(newData)
    return newData
  },

  async $update(journalGroupId: string, data: Partial<JournalApi.GroupData>) {
    const cache = await getAllJournalGroupsCache()
    const newData: JournalApi.GroupData = mergeObjects(cache[journalGroupId], data, {
      modified: new Date()
    })
  
    const whereToUpdate = buildJournalGroupPath(journalGroupId)
  
    await bson_writeFile(`${whereToUpdate}/${META_FILE_NAME}`, newData)
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