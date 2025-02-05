import type { IJournalCategoryData, JournalCategorySchema } from "client/api/journal"
import { mergeObjects } from "client/common"
import { createId } from "../utils"
import { journalCategoryFileHandler } from "../handlers"

export const journalCategoryData = {
  async create$(groupId: string, data: JournalCategorySchema) {
    const journalId = createId()
  
    const newData: IJournalCategoryData = mergeObjects(data, {
      id: journalId,
      created: new Date(),
    })
    
    await journalCategoryFileHandler.write$(groupId, journalId, newData)
  
    return newData
  },
  async update$(groupId: string, categoryId: string, data: Partial<IJournalCategoryData>) {
    const oldData = await journalCategoryFileHandler.read$(groupId, categoryId)
    const newData: IJournalCategoryData = mergeObjects(oldData, data, {
      modified: new Date()
    })
  
    await journalCategoryFileHandler.write$(groupId, categoryId, () => newData)

    return newData
  },
  async delete$(groupId: string, categoryId: string) {
    await journalCategoryFileHandler.delete$(groupId, categoryId)
  },
}