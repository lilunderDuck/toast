import { createEffect, Suspense } from "solid-js"
// ...
import { Editor, useEditorContext } from "~/features/editor"
import { useJournalContext } from "~/features/journal"
// ...
import getJournalData from "./index.data"

export default function JournalContent() {
  const journalData = getJournalData()
  const { event$, open$ } = useEditorContext()
  const { updateJournal$ } = useJournalContext()

  event$.on$('editor__onSwitching$', (oldData) => {
    updateJournal$(oldData.id, {
      // @ts-ignore
      data: oldData.content
    })
  })

  event$.on$('editor__onUpdate$', (data) => {
    updateJournal$(data.id, {
      // @ts-ignore
      data: data.content
    })
  })

  createEffect(() => {
    const data = journalData()
    if (data) {
      console.log("data fetched", data)
      open$({
        content: data.data,
        id: data.id
      })
    }
  })

  return (
    <Suspense>
      <Editor />
    </Suspense>
  )
}