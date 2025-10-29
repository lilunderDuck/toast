import { createAsync, useParams } from "@solidjs/router"
import { useJournalContext } from "~/features/journal"

export default function getJournalData() {
  return createAsync(async() => {
    const param = useParams()
    const { getJournal$, history$ } = useJournalContext()
    const data = await getJournal$(param.journalId)
    history$.setLastOpened$(data)
    return data
  })
}