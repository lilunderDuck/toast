import { createEffect, onCleanup } from "solid-js"
// ...
import { Editor, useEditorContext } from "~/features/editor"
import { useJournalContentPanelContext, useJournalContext } from "~/features/journal"
// ...
import getJournalData from "./index.data"

export default function JournalContent() {
  const journalData = getJournalData()
  const { event$, open$ } = useEditorContext()
  const { updateJournal$ } = useJournalContext()
  const { setCurrentlyOpenedJournal$ } = useJournalContentPanelContext()

  event$.on$(EditorEvent.ON_SWITCHING, (oldData) => {
    updateJournal$(oldData.id, {
      // @ts-ignore
      data: [oldData.content]
    })
  })

  event$.on$(EditorEvent.ON_UPDATE, (data) => {
    updateJournal$(data.id, {
      // @ts-ignore
      data: [data.content]
    })
  })

  createEffect(() => {
    const data = journalData()
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