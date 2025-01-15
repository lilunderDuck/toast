import type { IJournalCategoryData, IJournalData } from "~/api/journal"
import { getEverythingFromDir } from "~/server"
// ...
import { buildJournalGroupPath, createId, journalFs, journalGroupFs, META_FILE_NAME, groupTreeCache } from "../utils"
import { mergeObjects } from '~/common'

export async function getAllJournalData(groupId: string) {
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

  console.log('[journal]\t\t data returned', data)
  return data
}

export const journalData = {
  async $create(groupId: string, data: IJournalData) {
    console.group('[journal]\t\t creating journal')
    const journalId = createId()
  
    const newData: IJournalData = mergeObjects(data, {
      id: journalId,
      created: new Date(),
    })
    
    await journalFs.$writeFile(groupId, journalId, newData)

    console.log('[journal]\t\t updating journal count')
    await journalGroupFs.$writeMetaFile(groupId, (prev) => mergeObjects(prev, {
      entries: prev.entries + 1
    }))

    await groupTreeCache.set(groupId, newData)
  
    console.log('[journal]\t\t created', newData)
    console.groupEnd()
    return newData
  },
  
  async $update(groupId: string, journalId: string, data: Partial<IJournalData>) {
    console.group('[journal]\t\t Updating journal')
    const oldData = await journalFs.$readFile(groupId, journalId)
    const newData: IJournalData = mergeObjects(oldData, data, {
      modified: new Date()
    })
  
    await journalFs.$writeFile(groupId, journalId, () => newData)
    await groupTreeCache.set(groupId, newData)
  
    console.log('[journal]\t\t update from', oldData, 'to', newData)
    console.groupEnd()
    return newData
  },

  async $delete(groupId: string, journalId: string) {
    await journalFs.$deleteFile(groupId, journalId)

    console.log('[journal]\t\t updating journal count')
    await journalGroupFs.$writeMetaFile(groupId, (prev) => {
      const entries = prev.entries - 1
      return mergeObjects(prev, {
        entries: entries < 0 ? 0 : entries
      })
    })
  },
  
  async $getContent(groupId: string, journalId: string) {
    const data = await journalFs.$readFile<IJournalData>(groupId, journalId)
    console.log('[journal]\t\t data returned', data.data)
    return data.data ?? []
  }
}

export const journalCategoryData = {
  async $create(groupId: string, data: IJournalCategoryData) {
    const journalId = createId()
  
    const newData: IJournalCategoryData = mergeObjects(data, {
      id: journalId,
      created: new Date(),
    })
    
    await journalFs.$writeFile(groupId, journalId, newData)
  
    console.log('[journal]\t\t created category', newData)
    return newData
  },
  async $update(groupId: string, categoryId: string, data: Partial<IJournalCategoryData>) {
    const oldData = await journalFs.$readFile(groupId, categoryId)
    const newData: IJournalCategoryData = mergeObjects(oldData, data, {
      modified: new Date()
    })
  
    await journalFs.$writeFile(groupId, categoryId, () => newData)
  
    console.log('[journal]\t\t update category from', oldData, 'to', newData)
    return newData
  },
  async $delete(groupId: string, categoryId: string) {
    await journalFs.$deleteFile(groupId, categoryId)
  },
}