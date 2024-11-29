import { JournalData } from "~/api"

export type JournalEventMap = {
  journal__clickingJournal: (data: JournalData) => any
  journal__deletingJournal: (deleteRightAway: boolean, data: JournalData) => any
}