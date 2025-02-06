import type { IJournalData } from "~/api/journal"
import type { IEvent } from "~/utils"

export type JournalEventMap = {
  journal__createJournal(data: IJournalData): void
  journal__openJournal(data: IJournalData): void
  journal__deleteJournal(journalId: string): void
}

export type JournalEvent = IEvent<JournalEventMap>