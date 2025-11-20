import { createEffect, onCleanup } from "solid-js"
// ...
import { Editor, useEditorContext } from "~/features/editor"
import { useJournalContentPanelContext, useJournalContext } from "~/features/journal"
import type { notes } from "~/wailsjs/go/models"
// ...

interface IJournalContentEditorProps {
  journalData$: notes.NoteData | undefined
}

export function JournalContentEditor(props: IJournalContentEditorProps) {
  const { event$, open$ } = useEditorContext()
  const { updateJournal$ } = useJournalContext()
  const { setCurrentlyOpenedJournal$ } = useJournalContentPanelContext()

  event$.on$(EditorEvent.ON_SWITCHING, (oldData) => {
    updateJournal$(oldData.id, {
      data: oldData.content
    })
  })

  event$.on$(EditorEvent.ON_UPDATE, (data) => {
    updateJournal$(data.id, {
      data: data.content
    })
  })

  createEffect(() => {
    const data = props.journalData$
    if (data) {
      console.log("data fetched", data)
      setCurrentlyOpenedJournal$(data.name)
      open$({
        content: data.data,
        id: data.id
      })
    }
  })

  onCleanup(() => {
    setCurrentlyOpenedJournal$(undefined)
  })

  return (
    <Editor />
  )
}