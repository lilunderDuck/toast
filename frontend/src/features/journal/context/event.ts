import type { IJournalData } from "~/api/journal"
import type { IEvent } from "~/utils"

export type JournalEventMap = {
  journal__openJournal(data: IJournalData): void
  journal__deleteJournal(data: IJournalData): void
}

export type JournalEvent = IEvent<JournalEventMap>