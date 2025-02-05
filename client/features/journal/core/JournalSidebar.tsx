import { createSignal, lazy } from "solid-js"
import { BsHouseFill, BsTrello } from "solid-icons/bs"
import { useNavigate } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalSidebar.module.css"
// ...
import { 
  createLazyLoadedDialog, 
  Flex, 
  FlexCenterY, 
  ResizableHandle, 
  ResizablePanel
} from "client/components"
import type { IJournalData } from "client/api/journal"
// ...
import { 
  type ISidebarProps,
  QuickActionBar, 
  QuickActionItem, 
  Sidebar, 
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

  const goTo = useNavigate()
  const goHome = () => goTo('/')

  const deleteJournalModal = createLazyLoadedDialog(
    lazy(() => import('./modals/DeleteJournalModal')), 
    () => ({
      $journal: thingToDelete()!
    })
  )

  const [thingToDelete, setThingToDelete] = createSignal<IJournalData>()
  const clickingOpenJournal: ISidebarProps["onClickingOpen$"] = (journal) => {
    $journal.open$(journal.id)
    $journal.setCurrentlyOpened$(journal)
  }

  const clickingRemoveJournal: ISidebarProps["on$ClickingRemove"] = (journal) => {
    const deleteRightAway = $localStorage.get$('shouldShowDeleteConfirmationModal')
    console.log('should delete right away?', deleteRightAway)
    if (deleteRightAway) {
      return $journal.delete$(journal.id)
    }

    setThingToDelete(journal)
    deleteJournalModal.show$()
  }

  const toolModal = createLazyLoadedDialog(
    lazy(() => import('./modals/TrackingToolsModal'))
  )

  return (
    <>
      <ResizablePanel initialSize={0.3}>
        <FlexCenterY id={__style.iconTitleBar} {...stylex.attrs(style.titleBar)}>
          <QuickActionItem 
            $icon={BsHouseFill}
            label$='Go back to home'
            onClick={goHome}
          />
          <div  />
          <QuickActionItem 
            $icon={BsTrello}
            label$='Trackers'
            onClick={toolModal.show$}
          />
        </FlexCenterY>
        <Flex {...stylex.attrs(style.sidebar)}>
          <QuickActionBar />
          <Sidebar 
            onClickingOpen$={clickingOpenJournal} 
            on$ClickingRemove={clickingRemoveJournal}
          />
        </Flex>
      </ResizablePanel>
      <ResizableHandle />
      {/* ... */}
      <deleteJournalModal.$Modal />
      <toolModal.$Modal />
    </>
  )
}