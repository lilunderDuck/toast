import { Flex, ResizableHandle } from "~/components"
import { QuickActionBar, Sidebar, TabPanel } from "../components"
import stylex from "@stylexjs/stylex"
import { useJournalContext } from "../context"
import { useThisEditorContext } from "~/libs/editor"

const style = stylex.create({
  sidebar: {
    width: '100%',
    height: '100%'
  }
})

export function JournalSidebar() {
  const { $journal, $event } = useJournalContext()
  const { $open } = useThisEditorContext()

  $event.$on('journal__clickingJournal', (journal) => {
    $open({
      id: journal.id,
      content: journal.data ?? {
        version: '1',
        blocks: [],
        time: Date.now()
      }
    })
    $journal.$setCurrentlyOpened(journal)
  })

  $event.$on('journal__deletingJournal', (deleteRightAway, journal) => {
    if (deleteRightAway) {
      $journal.$delete(journal.id)
    }

    // else it's gonna show the confirmation modal
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
    </>
  )
}