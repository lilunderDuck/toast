import { useNavigate, useParams } from "@solidjs/router"
import { onMount } from "solid-js"
// ...
import { useJournalContext } from "./context"
import { autoSaveJournal, saveJournalData } from "./utils"
// ...
import { ThisEditor } from "~/libs/editor"
import { fetchIt } from "~/utils"
import { JOURNAL_CONTENT_ROUTE, JOURNAL_GROUP_ROUTE, JournalData, JournalGroupData } from "~/api"

export function JournalEditor() {
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
    $setCurrentlyOpenedJournal(journal)
  })

  ThisEditor.$onSwitching = (previous) => {
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
      <ThisEditor.$TitleBar name={$currentlyOpenedJournal()?.name} />
      <ThisEditor.$Editor />
      <ThisEditor.$StatusBar />
    </>
  )
}