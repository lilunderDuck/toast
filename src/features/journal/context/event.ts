import { JournalApi } from "~/api/journal"

export type JournalEventMap = {
  journal__clickingJournal: (data: JournalApi.JournalData) => any
  journal__deletingJournal: (deleteRightAway: boolean, data: JournalApi.JournalData) => any
}