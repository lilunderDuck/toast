import type { IJournalData, JournalSchema } from "~/api/journal"
// ...
import { mergeObjects } from '~/common'
// ...
import { createId, updateGroupEntriesCount } from "../utils"
import { 
  journalFileHandler, 
} from "../handlers"
import { 
  journalGroupTreeCache 
} from "../cache"

export const journalData = {
  async $create(groupId: string, data: JournalSchema) {
    const journalId = createId()
    const newData: IJournalData = mergeObjects(data, {
      id: journalId,
      created: new Date(),
    })
    
    await journalFileHandler.write$(groupId, journalId, newData)

    await journalGroupTreeCache.set(groupId, newData)
    return newData
  },
  
  async $update(groupId: string, journalId: string, data: Partial<IJournalData>) {
    const oldData = await journalFileHandler.read$(groupId, journalId)
    const newData: IJournalData = mergeObjects(oldData, data, {
      modified: new Date()
    })
  
    await journalFileHandler.write$(groupId, journalId, () => newData)
    await journalGroupTreeCache.set(groupId, newData)
  
    return newData
  },

  async $delete(groupId: string, journalId: string) {
    await journalFileHandler.delete$(groupId, journalId)
    await journalGroupTreeCache.remove(groupId, journalId)
    await updateGroupEntriesCount(groupId, (prev) => prev - 1)
  },
  
  async $getContent(groupId: string, journalId: string) {
    const data = await journalFileHandler.read$(groupId, journalId)
    return data.data ?? []
  }
}