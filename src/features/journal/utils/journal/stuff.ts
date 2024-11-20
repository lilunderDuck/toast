import { Journal, JOURNAL_CONTENT_ROUTE, JOURNAL_ROUTE, JournalData } from "~/api"
import { fetchIt } from "~/utils"

export function createJournal(currentJournalGroupId: string, data: Journal) {
  return fetchIt<JournalData>('POST', `${JOURNAL_ROUTE}?id=${currentJournalGroupId}`, data)
}

export function deleteJournal(currentJournalGroupId: string, journalId: string) {
  return fetchIt<JournalData>('DELETE', `${JOURNAL_ROUTE}?id=${currentJournalGroupId}&journal=${journalId}`)
}

export function getAllJournals(currentJournalGroupId: string) {
  return fetchIt<JournalData[]>('GET', `${JOURNAL_CONTENT_ROUTE}?id=${currentJournalGroupId}`)
}