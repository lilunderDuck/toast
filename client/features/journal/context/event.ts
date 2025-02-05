import type { IJournalData } from "client/api/journal"
import type { IEvent } from "client/utils"

export type JournalEventMap = {
  journal__createJournal(data: IJournalData): void
  journal__openJournal(data: IJournalData): void
  journal__deleteJournal(journalId: string): void
}

export type JournalEvent = IEvent<JournalEventMap>