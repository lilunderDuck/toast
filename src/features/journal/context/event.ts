import { JournalData } from "~/api"
import { createEvent } from "~/utils"

export type JournalEventMap = {
  journal__clickingJournal: (data: JournalData) => any
}

export const $event = createEvent<JournalEventMap>()