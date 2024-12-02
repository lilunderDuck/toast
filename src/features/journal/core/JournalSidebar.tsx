import stylex from "@stylexjs/stylex"
import { createSignal, lazy, onMount } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
// ...
import { createLazyLoadedDialog, Flex, ResizableHandle } from "~/components"
import { fetchIt } from "~/utils"
import { 
  JOURNAL_GROUP_ROUTE, 
  type JournalApi
} from "~/api/journal"
// ...
import { QuickActionBar, Sidebar, TabPanel } from "../components"
import { useJournalContext } from "../context"

const DeleteJournalModal = lazy(() => import('./delete-journal-modal'))

const style = stylex.create({
  sidebar: {
    width: '100%',
    height: '100%'
  }
})

export function JournalSidebar() {
  const { $journal, $event } = useJournalContext()
  const [, setTree] = $journal.$fileTree

  const param = useParams()
  const goTo = useNavigate()
  onMount(async() => {
    const data = await fetchIt<JournalApi.GroupData>('GET', `${JOURNAL_GROUP_ROUTE}?id=${param.id}`)
    if (!data) {
      return goTo('/')
    }

    $journal.$setCurrentGroup(data)
    const tree = await $journal.$getAll()

    setTree(tree!)
  })

  const deleteJournalModal = createLazyLoadedDialog()
  const [thingToDelete, setThingToDelete] = createSignal<JournalApi.JournalData>()
  $event.$on('journal__clickingJournal', (journal) => {
    $journal.$open(journal.id)
    $journal.$setCurrentlyOpened(journal)
  })

  $event.$on('journal__deletingJournal', (deleteRightAway, journal) => {
    if (deleteRightAway) {
      return $journal.$delete(journal.id)
    }

    setThingToDelete(journal)
    deleteJournalModal.$show()
  })

  return (
    <>
      <TabPanel initialSize={0.3}>
        <div></div>
        <Flex {...stylex.attrs(style.sidebar)}>
          <QuickActionBar />
          <Sidebar />
        </Flex>
      </TabPanel>
      <ResizableHandle />
      {/* ... */}
      <deleteJournalModal.$Modal>
        <DeleteJournalModal 
          $close={deleteJournalModal.$close} 
          $journal={thingToDelete()!}
        />
      </deleteJournalModal.$Modal>
    </>
  )
}