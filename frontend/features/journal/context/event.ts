import type { IJournalCategoryData, IJournalData, JournalType } from "~/api/journal"
import type { IEvent } from "~/utils"

interface ICreatedJournalEventMapping {
  [JournalType.journal]: [data: IJournalData]
  [JournalType.category]: [data: IJournalCategoryData]
}

export type JournalEventMap = {
  journal__openJournal$(data: IJournalData): void
  journal__deleteJournal$(data: IJournalData): void
  journal__createdJournal$<T extends JournalType>(type: T, ...stuff: ICreatedJournalEventMapping[T]): any
}

export type JournalEvent = IEvent<JournalEventMap>