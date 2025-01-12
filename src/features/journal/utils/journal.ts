import { JOURNAL_CONTENT_ROUTE, JOURNAL_ROUTE, JournalApi } from "~/api/journal"
import { fetchIt } from "~/utils"

export async function api_createJournal(currentGroupId: string, data: JournalApi.Journal, type: JournalApi.FileType) {
  const route = `${JOURNAL_ROUTE}?id=${currentGroupId}&type=${type}`
  return await fetchIt('POST', route, data) as JournalApi.IJournalData
}

export async function api_deleteJournal(currentGroupId: string, someJournalId: string) {
  return fetchIt('DELETE', `${JOURNAL_ROUTE}?id=${currentGroupId}&journal=${someJournalId}`)
}

export async function api_getAllJournals(currentGroupId: string) {
  return await fetchIt('GET', `${JOURNAL_ROUTE}?id=${currentGroupId}`) as JournalApi.IJournalData[]
}

export function api_saveJournalContent(
  currentGroupId: string, 
  someJournalId: string, 
  data: JournalApi.JournalContentData
) {
  return fetchIt('POST', `${JOURNAL_CONTENT_ROUTE}?id=${currentGroupId}&journal=${someJournalId}`, data)
}

export async function api_getJournalContent(
  currentGroupId: string, 
  someJournalId: string
) {
  return await fetchIt('GET', `${JOURNAL_CONTENT_ROUTE}?id=${currentGroupId}&journal=${someJournalId}`) as JournalApi.JournalContentData
}