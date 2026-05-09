import { createEffect, onCleanup } from "solid-js"
// ...
import { useJournalContentPanelContext, useJournalContext } from "~/features/journal"
import type { notes } from "~/wailsjs/go/models"
// ...

interface IJournalContentEditorProps {
  journalData$: notes.NoteData | undefined
}

export function JournalContentEditor(props: IJournalContentEditorProps) {
  const { updateJournal$ } = useJournalContext()
  const { setCurrentlyOpenedJournal$ } = useJournalContentPanelContext()

  createEffect(() => {
    const data = props.journalData$
    if (!data) return
    console.log("data fetched", data)
    setCurrentlyOpenedJournal$(data.name)
  })

  onCleanup(() => {
    setCurrentlyOpenedJournal$(undefined)
  })

  return (
    <></>
  )
}