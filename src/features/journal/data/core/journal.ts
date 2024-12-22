import { JournalApi } from "~/api/journal"
import { getEverythingFromDir } from "~/server"
// ...
import { buildJournalGroupPath, createId, journalFs, journalGroupFs, META_FILE_NAME } from "../utils"
import { mergeObjects } from '~/common'

export const journalData = {
  async $create(groupId: string, data: JournalApi.Journal) {
    const journalId = createId()
  
    const newData: JournalApi.IJournalData = mergeObjects(data, {
      id: journalId,
      created: new Date(),
    })
    
    await journalFs.$writeFile(groupId, journalId, newData)

    console.log('[journal] updating journal count')
    await journalGroupFs.$writeMetaFile(groupId, (prev) => mergeObjects(prev, {
      entries: prev.entries + 1
    }))
  
    console.log('[journal] created', newData)
    return newData
  },

  async $createCategory(groupId: string, data: JournalApi.Category) {
    const journalId = createId()
  
    const newData: JournalApi.ICategoryData = mergeObjects(data, {
      id: journalId,
      created: new Date(),
    })
    
    await journalFs.$writeFile(groupId, journalId, newData)
  
    console.log('[journal] created category', newData)
    return newData
  },
  
  async $update(groupId: string, journalId: string, data: Partial<JournalApi.SavedJournalData>) {
    const oldData = await journalFs.$readFile(groupId, journalId)
    const newData: JournalApi.SavedJournalData = mergeObjects(oldData, data, {
      modified: new Date()
    })
  
    await journalFs.$writeFile(groupId, journalId, () => newData)
  
    console.log('[journal] update from', oldData, 'to', newData)
    return newData
  },

  async $updateCategory(groupId: string, categoryId: string, data: Partial<JournalApi.Category>) {
    const oldData = await journalFs.$readFile(groupId, categoryId)
    const newData: JournalApi.SavedJournalData = mergeObjects(oldData, data, {
      modified: new Date()
    })
  
    await journalFs.$writeFile(groupId, categoryId, () => newData)
  
    console.log('[journal] update category from', oldData, 'to', newData)
    return newData
  },
  
  async $delete(groupId: string, journalId: string) {
    await journalFs.$deleteFile(groupId, journalId)

    console.log('[journal] updating journal count')
    await journalGroupFs.$writeMetaFile(groupId, (prev) => {
      const entries = prev.entries - 1
      return mergeObjects(prev, {
        entries: entries < 0 ? 0 : entries
      })
    })
  },

  async $deleteCategory(groupId: string, categoryId: string) {
    await journalFs.$deleteFile(groupId, categoryId)
  },
  
  async $getContent(groupId: string, journalId: string) {
    const data = await journalFs.$readFile<JournalApi.SavedJournalData>(groupId, journalId)
    console.log('[journal] data returned', data.data)
    return data.data ?? []
  },
  
  async $getAll(groupId: string) {
    const thisJournalGroupPath = buildJournalGroupPath(groupId)
    const journals = (await getEverythingFromDir(thisJournalGroupPath))
      .filter(it => it.endsWith('.dat') && it !== META_FILE_NAME)
    // 
  
    console.log(journals)
    const data = []
    for (const journalFile of journals) {
      const dataFetched = await journalFs.$readFile(groupId, journalFile.replace('.dat', ''))
      if (dataFetched) data.push(dataFetched)
    }
  
    console.log('[journal] data returned', data)
    return data
  }
}