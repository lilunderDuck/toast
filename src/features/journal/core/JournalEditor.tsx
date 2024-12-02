import { useJournalContext } from "../context"
// ...
import { 
  ThisEditor, 
  ThisEditorStatusBar,
  ThisEditorTitleBar, 
  useThisEditorContext 
} from "~/features/editor"

export function JournalEditor() {
  const { $journal } = useJournalContext()
  const { $event } = useThisEditorContext()

  $event.$on('editor_onSwitching', (previous) => {
    if (previous) {
      // saveJournalData($journal.$currentGroup, previous.id, previous.content)
    }
  })

  $event.$on('editor_onUpdate', async(data) => {
    await $journal.$save(data.id, data.content)
  })

  return (
    <>
      <ThisEditorTitleBar name={$journal.$currentlyOpened()?.name} />
      <ThisEditor />
      <ThisEditorStatusBar />
    </>
  )
}