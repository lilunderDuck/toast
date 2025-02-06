import { 
  type IClientJournalVirturalFileTreeData,
  type IJournalData, 
  JOURNAL_ROUTE, 
  JOURNAL_GROUP_ROUTE, 
  type JournalContentData, 
  JournalFileType, 
  type JournalSchema, 
  type JournalVituralFileTree
} from "~/api/journal"
import { fetchIt } from "~/utils"

export async function api_createJournal(currentGroupId: string, data: JournalSchema, type: JournalFileType) {
  const route = `${JOURNAL_ROUTE}/${currentGroupId}?type=${type}` as const
  return await fetchIt('POST', route, data) as IJournalData
}

export async function api_deleteJournal(currentGroupId: string, someJournalId: string) {
  return fetchIt('DELETE', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`)
}

export async function api_getAllJournals(currentGroupId: string) {
  return await fetchIt('GET', `${JOURNAL_ROUTE}/${currentGroupId}`) as IJournalData[]
}

export function api_saveJournalContent(
  currentGroupId: string, 
  someJournalId: string, 
  data: JournalContentData
) {
  return fetchIt('PATCH', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`, data)
}

export async function api_getJournalContent(
  currentGroupId: string, 
  someJournalId: string
) {
  return await fetchIt('GET', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`) as JournalContentData
}

export async function api_getJournalVirturalFileTree(
  currentGroupId: string
) {
  return await fetchIt('GET', `${JOURNAL_GROUP_ROUTE}/${currentGroupId}`) as IClientJournalVirturalFileTreeData
}

export async function api_updateJournalVirturalFileTree(
  currentGroupId: string,
  data: JournalVituralFileTree.Tree
) {
  return await fetchIt('PATCH', `${JOURNAL_GROUP_ROUTE}/${currentGroupId}`, data) as IClientJournalVirturalFileTreeData
}