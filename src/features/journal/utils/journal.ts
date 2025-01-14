import { JOURNAL_ROUTE, JournalApi } from "~/api/journal"
import { fetchIt } from "~/utils"

export async function api_createJournal(currentGroupId: string, data: JournalApi.Journal, type: JournalApi.FileType) {
  const route = `${JOURNAL_ROUTE}/${currentGroupId}?type=${type}` as const
  return await fetchIt('POST', route, data) as JournalApi.IJournalData
}

export async function api_deleteJournal(currentGroupId: string, someJournalId: string) {
  return fetchIt('DELETE', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`)
}

export async function api_getAllJournals(currentGroupId: string) {
  return await fetchIt('GET', `${JOURNAL_ROUTE}/${currentGroupId}`) as JournalApi.IJournalData[]
}

export function api_saveJournalContent(
  currentGroupId: string, 
  someJournalId: string, 
  data: JournalApi.JournalContentData
) {
  return fetchIt('PATCH', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`, data)
}

export async function api_getJournalContent(
  currentGroupId: string, 
  someJournalId: string
) {
  return await fetchIt('GET', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`) as JournalApi.JournalContentData
}