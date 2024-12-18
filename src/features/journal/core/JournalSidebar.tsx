import { createSignal, lazy, onMount } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
import { BsHouseFill, BsLayoutSidebarInsetReverse, BsTrello } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalSidebar.module.css"
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
import { toast } from "~/features/toast"
// ...
import { 
  QuickActionBar, 
  QuickActionItem, 
  Sidebar, 
  type ISidebarProps, 
  TabPanel, 
  useTabContext
} from "../components"
import { useJournalContext } from "../context"

const style = stylex.create({
  sidebar: {
    width: '100%',
    height: '100%'
  },
  titleBar: {
    padding: 5,
    gap: 5
  }
})

export function JournalSidebar() {
  const { $journal, $localStorage } = useJournalContext()
  const { $getFocusedTab, $updateTab } = useTabContext()
  const [, setTree] = $journal.$fileTree

  const param = useParams()
  const goTo = useNavigate()
  const goHome = () => goTo('/')

  onMount(async() => {
    const data = await fetchIt<JournalApi.IGroupData>('GET', `${JOURNAL_GROUP_ROUTE}?id=${param.id}`)
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
    lazy(() => import('./modals/DeleteJournalModal')), 
    () => ({
      $journal: thingToDelete()!
    })
  )
  
  const [thingToDelete, setThingToDelete] = createSignal<JournalApi.IJournalData>()
  const clickingOpenJournal: ISidebarProps["$onClickingOpen"] = (journal) => {
    $journal.$open(journal.id)
    $journal.$setCurrentlyOpened(journal)
    const focusedTab = $getFocusedTab()
    $updateTab(focusedTab.id, journal.name)
  }

  const clickingRemoveJournal: ISidebarProps["$onClickingRemove"] = (journal) => {
    const deleteRightAway = $localStorage.$get('shouldShowDeleteConfirmationModal')
    console.log('should delete right away?', deleteRightAway)
    if (deleteRightAway) {
      return $journal.$delete(journal.id)
    }

    setThingToDelete(journal)
    deleteJournalModal.$show()
  }

  const toolModal = createLazyLoadedDialog(
    lazy(() => import('./modals/TrackingToolsModal'))
  )

  return (
    <>
      <TabPanel initialSize={0.3}>
        <FlexCenterY id={__style.iconTitleBar} {...stylex.attrs(style.titleBar)}>
          <QuickActionItem 
            $icon={BsLayoutSidebarInsetReverse}
            $label='Hide sidebar'
            onClick={() => {}}
          />
          <div  />
          <QuickActionItem 
            $icon={BsHouseFill}
            $label='Go back to home'
            onClick={goHome}
          />
          <QuickActionItem 
            $icon={BsTrello}
            $label='Trackers'
            onClick={toolModal.$show}
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
      <toolModal.$Modal />
    </>
  )
}