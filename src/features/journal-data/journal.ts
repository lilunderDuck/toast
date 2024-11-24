import { Journal, JournalData } from "~/api"
import { buildJournalGroupPath } from "./journalGroup"
import { bson_readFile, bson_writeFile, deleteFile, getEverythingFromDir } from "~/server"
import crypto from 'node:crypto'

export async function createJournal(groupId: string, data: Journal) {
  const journalId = crypto.randomBytes(5).toString('hex')
  const whereToUpdate = `${buildJournalGroupPath(groupId)}/${journalId}.dat` as const

  const newData: JournalData = {
    id: journalId,
    created: new Date(),
    ...data
  }

  await bson_writeFile(whereToUpdate, newData)
  return newData
}

export async function updateJournal(groupId: string, journalId: string, data: Partial<JournalData>) {
  const whereToUpdate = `${buildJournalGroupPath(groupId)}/${journalId}.dat` as const

  const oldData = await bson_readFile<JournalData>(whereToUpdate) ?? {}
  const newData = {
    ...oldData,
    ...data as Journal,
    modified: new Date()
  } as JournalData

  console.log('[journal] update from', oldData, 'to', newData)

  await bson_writeFile(whereToUpdate, newData)
  return newData
}

export async function deleteJournal(groupId: string, journalId: string) {
  const whereToDelete = `${buildJournalGroupPath(groupId)}/${journalId}.dat` as const

  await deleteFile(whereToDelete)
}

export async function getAllJournals(groupId: string) {
  const thisJournalGroupPath = buildJournalGroupPath(groupId)
  const journals = (await getEverythingFromDir(thisJournalGroupPath))
    .filter(it => it.endsWith('.dat') && it !== 'meta.dat')
  // 

  console.log(journals)
  const data = []
  for (const journalFile of journals) {
    const dataFetched = await bson_readFile<JournalData>(`${thisJournalGroupPath}/${journalFile}`)
    if (dataFetched) data.push(dataFetched)
  }

  return data
}