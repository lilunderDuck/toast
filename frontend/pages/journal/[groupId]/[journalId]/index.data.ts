import { createAsync, useParams } from "@solidjs/router"
import { useJournalContext } from "~/features/journal"

export default function getJournalData() {
  return createAsync(() => {
    const param = useParams()
    const { getJournal$ } = useJournalContext()
    return getJournal$(parseInt(param.journalId))
  })
}