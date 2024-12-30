import { JournalApi } from "~/api/journal"

export type JournalEventMap = {
  journal__createJournal(data: JournalApi.IJournalData): void
}