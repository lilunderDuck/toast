import { useNavigate, useParams } from "@solidjs/router"
import { onMount } from "solid-js"
// ...
import { useJournalContext } from "../context"
// ...
import { 
  ThisEditor, 
  ThisEditorStatusBar,
  ThisEditorTitleBar, 
  useThisEditorContext 
} from "~/features/editor"
import { fetchIt } from "~/utils"
import { 
  JOURNAL_GROUP_ROUTE, 
  type JournalApi
} from "~/api/journal"

export function JournalEditor() {
  const param = useParams()
  const goTo = useNavigate()
  // ...
  const { $journal } = useJournalContext()
  const { $event } = useThisEditorContext()
  const [, setTree] = $journal.$fileTree

  $event.$on('editor_onSwitching', (previous) => {
    if (previous) {
      // saveJournalData($journal.$currentGroup, previous.id, previous.content)
    }
  })

  $event.$on('editor_onUpdate', async(data) => {
    await $journal.$save(data.id, data.content)
  })

  onMount(async() => {
    const data = await fetchIt<JournalApi.GroupData>('GET', `${JOURNAL_GROUP_ROUTE}?id=${param.id}`)
    if (!data) {
      return goTo('/')
    }

    $journal.$setCurrentGroup(data)
    const tree = await $journal.$getAll()

    setTree(tree!)
  })

  return (
    <>
      <ThisEditorTitleBar name={$journal.$currentlyOpened()?.name} />
      <ThisEditor />
      <ThisEditorStatusBar />
    </>
  )
}