import { onCleanup, onMount } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
// ...
import { bodyClasslist, fetchIt } from "~/utils"
import { 
  JOURNAL_CONTENT_ROUTE, 
  JOURNAL_GROUP_ROUTE, 
  JournalData, 
  type JournalGroupData 
} from "~/api"
import { 
  JournalProvider, 
  useJournalContext,
  EditorContent, 
  TitleBar,
  EditorTitleBar,
  saveJournalData,
  autoSaveJournal
} from "~/features/journal"
import __style from '~/features/journal/index.module.css'
import { ThisEditor } from "~/libs/editor"

export default function JournalPage() {
  bodyClasslist().add(__style.journal)

  onCleanup(() => {
    bodyClasslist().remove(__style.journal)
  })
 
  return (
    <JournalProvider>
      <TitleBar />
      <EditorContent>
        <Content />
      </EditorContent>
    </JournalProvider>
  )
}

function Content() {
  const param = useParams()
  const goTo = useNavigate()
  // ...
  const { 
    $currentlyOpenedJournal, 
    $setCurrentlyOpenedJournal,
    $currentGroup,
    $setCurrentGroup, 
    $tree, 
    $event 
  } = useJournalContext()
  const [, setTree] = $tree

  $event.$on('journal__clickingJournal', (journal) => {
    ThisEditor.$open({
      id: journal.id,
      content: journal.data ?? {}
    })
    $setCurrentlyOpenedJournal(journal.name)
  })

  ThisEditor.$onSwitching = (previous, current) => {
    if (previous) {
      saveJournalData($currentGroup, previous.id, previous.content)
    }
  }

  ThisEditor.$onUpdate = (data) => {
    autoSaveJournal($currentGroup, data.id, data.content)
  }

  onMount(async() => {
    const data = await fetchIt<JournalGroupData>('GET', `${JOURNAL_GROUP_ROUTE}?id=${param.id}`)
    const tree = await fetchIt<JournalData[]>('GET', `${JOURNAL_CONTENT_ROUTE}?id=${param.id}`)
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
      <EditorTitleBar $name={$currentlyOpenedJournal()} />
      <ThisEditor.$Editor />
    </>
  )
}