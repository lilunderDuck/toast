import crypto from 'node:crypto'
// ...
import { 
  JournalGroupData,
  type JournalGroup 
} from "~/api"
import { 
  bson_writeFile,
  createDirectoryIfNotExist, 
  isThisDirectoryExist
} from "../../utils"
import { JOURNALS_FOLDER } from "../../internals"
import { getAllJournalGroupsCache, updateJournalGroupsCache } from './cache'

export const buildJournalGroupPath = <const T extends string>(path: T) => `${JOURNALS_FOLDER}/${path}` as const
export async function createJournalGroup(data: JournalGroup) {
  const journalGroupId = crypto.randomBytes(5).toString('hex')
  const newData: JournalGroupData = {
    ...data,
    id: journalGroupId,
    created: new Date(),
    entries: 0
  }

  const whereToCreate = buildJournalGroupPath(journalGroupId)

  await createDirectoryIfNotExist(whereToCreate)
  await bson_writeFile(`${whereToCreate}/meta.dat`, newData)
  await updateJournalGroupsCache(newData)
  return newData
}

export async function updateJournalGroup(journalGroupId: string, data: Partial<JournalGroupData>) {
  const cache = await getAllJournalGroupsCache()
  const newData: JournalGroupData = {
    ...cache[journalGroupId],
    ...data,
    modified: new Date()
  }

  const whereToUpdate = buildJournalGroupPath(journalGroupId)

  await bson_writeFile(`${whereToUpdate}/meta.dat`, newData)
  await updateJournalGroupsCache(newData)
  return newData
}

export async function getAllJournalGroups() {
  return Object.values(await getAllJournalGroupsCache())
}

export async function getJournalGroup(id: string) {
  return (await getAllJournalGroupsCache())[id]
}

export function isJournalGroupExist(journalGroupId: string) {
  return isThisDirectoryExist(buildJournalGroupPath(journalGroupId))
}