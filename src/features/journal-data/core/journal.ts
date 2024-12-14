import crypto from 'node:crypto'
// ...
import { JournalApi } from "~/api/journal"
import { bson_readFile, bson_writeFile, deleteFile, getEverythingFromDir } from "~/server"
// ...
import { buildJournalGroupPath } from "../utils"
import { mergeObjects } from '~/common'

export const journalData = {
  async $create(groupId: string, data: JournalApi.Journal) {
    const journalId = crypto.randomBytes(5).toString('hex')
    const whereToUpdate = `${buildJournalGroupPath(groupId)}/${journalId}.dat` as const
  
    const newData: JournalApi.JournalData = mergeObjects(data, {
      id: journalId,
      created: new Date(),
    })
    
    await bson_writeFile(whereToUpdate, newData)
  
    console.log('[journal] created', newData)
    return newData
  },

  async $createCategory(groupId: string, data: JournalApi.Category) {
    // ...
  },
  
  async $update(groupId: string, journalId: string, data: Partial<JournalApi.SavedJournalData>) {
    const whereToUpdate = `${buildJournalGroupPath(groupId)}/${journalId}.dat` as const
  
    const oldData = await bson_readFile<JournalApi.SavedJournalData>(whereToUpdate) ?? {}
    const newData: JournalApi.SavedJournalData = mergeObjects(oldData, data, {
      modified: new Date()
    })
  
    await bson_writeFile(whereToUpdate, newData)
  
    console.log('[journal] update from', oldData, 'to', newData)
    return newData
  },

  async $updateCategory(groupId: string, data: Partial<JournalApi.Category>) {
    // ...
  },
  
  async $delete(groupId: string, journalId: string) {
    const whereToDelete = `${buildJournalGroupPath(groupId)}/${journalId}.dat` as const
  
    await deleteFile(whereToDelete)
  },

  async $deleteCategory(groupId: string, data: JournalApi.Category) {
    // ...
  },
  
  async $get(groupId: string, journalId: string) {
    const thisJournalGroupPath = buildJournalGroupPath(groupId)
  
    const data = await bson_readFile<JournalApi.SavedJournalData>(`${thisJournalGroupPath}/${journalId}.dat`)
    console.log('[journal] data returned', data?.data)
    return data?.data ?? []
  },
  
  async $getAll(groupId: string) {
    const thisJournalGroupPath = buildJournalGroupPath(groupId)
    const journals = (await getEverythingFromDir(thisJournalGroupPath))
      .filter(it => it.endsWith('.dat') && it !== 'meta.dat')
    // 
  
    console.log(journals)
    const data = []
    for (const journalFile of journals) {
      const dataFetched = await bson_readFile<JournalApi.SavedJournalData>(`${thisJournalGroupPath}/${journalFile}`)
      if (dataFetched) data.push(dataFetched)
    }
  
    console.log('[journal] data returned', data)
    return data
  }
}