import { createSignal, lazy } from "solid-js"
import { BsHouseFill, BsTrello } from "solid-icons/bs"
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
import { 
  type JournalApi
} from "~/api/journal"
// ...
import { 
  QuickActionBar, 
  QuickActionItem, 
  Sidebar, 
  type ISidebarProps, 
  TabPanel, 
  useTabContext,
  useJournalContext
} from "../components"
import { useNavigate } from "@solidjs/router"

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

  const goTo = useNavigate()
  const goHome = () => goTo('/')

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
            $icon={BsHouseFill}
            $label='Go back to home'
            onClick={goHome}
          />
          <div  />
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