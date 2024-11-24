import { JournalData } from "~/api"
import { createEvent } from "~/utils"

export type JournalEventMap = {
  journal__clickingJournal: (data: JournalData) => any
  journal__deletingJournal: (deleteRightAway: boolean, data: JournalData) => any
}

export const $event = createEvent<JournalEventMap>()