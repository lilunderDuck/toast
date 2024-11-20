import { useNavigate, useParams } from "@solidjs/router"
import { onMount } from "solid-js"
// ...
import { useJournalContext } from "../context"
import { 
  autoSaveJournal, 
  getAllJournals, 
  saveJournalData 
} from "../utils"
// ...
import { 
  ThisEditor, 
  ThisEditorStatusBar,
  ThisEditorTitleBar, 
  useThisEditorContext 
} from "~/libs/editor"
import { fetchIt } from "~/utils"
import { 
  JOURNAL_GROUP_ROUTE, 
  JournalGroupData 
} from "~/api"

export function JournalEditor() {
  const param = useParams()
  const goTo = useNavigate()
  // ...
  const { 
    $currentlyOpenedJournal,
    $currentGroup,
    $setCurrentGroup, 
    $tree, 
  } = useJournalContext()
  const { $event } = useThisEditorContext()
  const [, setTree] = $tree

  $event.$on('editor_onSwitching', (previous) => {
    if (previous) {
      saveJournalData($currentGroup, previous.id, previous.content)
    }
  })

  $event.$on('editor_onUpdate', (data) => {
    autoSaveJournal($currentGroup, data.id, data.content)
  })

  onMount(async() => {
    const data = await fetchIt<JournalGroupData>('GET', `${JOURNAL_GROUP_ROUTE}?id=${param.id}`)
    const tree = await getAllJournals(param.id)
    if (!data) {
      return goTo('/')
    }

    console.log(tree)
    console.log(data)

    setTree(tree!)
    $setCurrentGroup(data)
  })

  return (
    <>
      <ThisEditorTitleBar name={$currentlyOpenedJournal()?.name} />
      <ThisEditor />
      <ThisEditorStatusBar />
    </>
  )
}