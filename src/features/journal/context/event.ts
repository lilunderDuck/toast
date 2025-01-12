import type { JournalApi } from "~/api/journal"
import type { IEvent } from "~/utils"

export type JournalEventMap = {
  journal__createJournal(data: JournalApi.IJournalData): void
  journal__openJournal(data: JournalApi.IJournalData): void
  journal__deleteJournal(journalId: string): void
}

export type JournalEvent = IEvent<JournalEventMap>