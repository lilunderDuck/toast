import { JournalContentEditor } from "~/features/journal"
// ...
import getJournalData from "./index.data"

export default function JournalContent() {
  const journalData = getJournalData()

  return (
    <JournalContentEditor journalData$={journalData()} />
  )
}