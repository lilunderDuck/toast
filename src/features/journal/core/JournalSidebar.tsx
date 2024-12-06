import stylex from "@stylexjs/stylex"
import { createSignal, lazy, onMount } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
// ...
import { 
  createLazyLoadedDialog, 
  Flex, 
  FlexCenterY, 
  ResizableHandle 
} from "~/components"
import { fetchIt } from "~/utils"
import { 
  JOURNAL_GROUP_ROUTE, 
  type JournalApi
} from "~/api/journal"
// ...
import { 
  QuickActionBar, 
  QuickActionItem, 
  Sidebar, 
  type ISidebarProps, 
  TabPanel 
} from "../components"
import { useJournalContext } from "../context"
import { BsHouseFill } from "solid-icons/bs"
import { toast } from "~/features/toast"

const style = stylex.create({
  sidebar: {
    width: '100%',
    height: '100%'
  }
})

export function JournalSidebar() {
  const { $journal, $localStorage } = useJournalContext()
  const [, setTree] = $journal.$fileTree

  const param = useParams()
  const goTo = useNavigate()
  const goHome = () => goTo('/')

  onMount(async() => {
    const data = await fetchIt<JournalApi.GroupData>('GET', `${JOURNAL_GROUP_ROUTE}?id=${param.id}`)
    if (!data) return goHomeImmediately()
    // note: you should not reorder this line of code here, otherwise it *will* break
    $journal.$setCurrentGroup(data)

    const tree = await $journal.$getAll()
    if (!tree) return goHomeImmediately()

    setTree(tree!)
  })

  const goHomeImmediately = () => {
    console.error(`[complete panic] Failed to get some data from ${param.id}. You're now going back to home page...`)
    toast.error('Failed to open that journal group. It may be deleted or corrupted.')
    return goHome()
  }

  const deleteJournalModal = createLazyLoadedDialog(
    lazy(() => import('./delete-journal-modal')), 
    () => ({
      $journal: thingToDelete()!
    })
  )
  
  const [thingToDelete, setThingToDelete] = createSignal<JournalApi.JournalData>()
  const clickingOpenJournal: ISidebarProps["$onClickingOpen"] = (journal) => {
    $journal.$open(journal.id)
    $journal.$setCurrentlyOpened(journal)
  }

  const clickingRemoveJournal: ISidebarProps["$onClickingRemove"] = (journal) => {
    const deleteRightAway = $localStorage.$get('shouldShowDeleteConfirmationModal')
    if (deleteRightAway) {
      return $journal.$delete(journal.id)
    }

    setThingToDelete(journal)
    deleteJournalModal.$show()
  }

  return (
    <>
      <TabPanel initialSize={0.3}>
        <FlexCenterY>
          <QuickActionItem 
            $icon={BsHouseFill}
            onClick={() => goHome()}
          />
        </FlexCenterY>
        <Flex {...stylex.attrs(style.sidebar)}>
          <QuickActionBar />
          <Sidebar 
            $onClickingOpen={clickingOpenJournal} 
            $onClickingRemove={clickingRemoveJournal}
          />
        </Flex>
      </TabPanel>
      <ResizableHandle />
      {/* ... */}
      <deleteJournalModal.$Modal />
    </>
  )
}