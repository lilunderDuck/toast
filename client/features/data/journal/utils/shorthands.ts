import { getEverythingFromDir } from "client/server"
import { buildJournalGroupPath } from "./stuff"
import { journalCategoryFileHandler, journalGroupFileHandler, META_FILE_NAME } from "../handlers"
import { mergeObjects } from "client/common"
import { JournalVituralFileTree } from "client/api/journal"

export async function getAllJournalData(groupId: string): Promise<JournalVituralFileTree.Data[]> {
  const thisJournalGroupPath = buildJournalGroupPath(groupId)
  const journals = (await getEverythingFromDir(thisJournalGroupPath))
    .filter(it => it.endsWith('.dat') && it !== META_FILE_NAME)
  // 

  console.log(journals)
  const data = []
  for (const journalFile of journals) {
    const dataFetched = await journalCategoryFileHandler.read$(groupId, journalFile.replace('.dat', ''))
    if (dataFetched) data.push(dataFetched)
  }

  console.log('[journal]\t\t data returned', data)
  return data
}

type Setter<T> = (prev: T) => T

export async function updateGroupEntriesCount(groupId: string, count: Setter<number>) {
  await journalGroupFileHandler.write$(groupId, (prev) => mergeObjects(prev, {
    entries: count(prev.entries)
  }))
}