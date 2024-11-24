import stylex from "@stylexjs/stylex"
import { createSignal, For, lazy } from "solid-js"
// ...
import { createLazyLoadedDialog, Divider } from "~/components"
import type { JournalData } from "~/api"
// ...
import { useJournalContext } from "../../../context"
import { SidebarButtonsRow } from "./SidebarButtonsRow"
import { Journal } from "./file-display"

const DeleteJournalModal = lazy(() => import('./delete-stuff'))

const style = stylex.create({
  sidebar: {
    width: '100%',
    paddingInline: 5,
    paddingTop: 5
  },
  content: {
    height: 'calc(100vh - (20px + 100px))'
  }
})

export function Sidebar(props: HTMLAttributes<"div">) {
  const { $journal, $event } = useJournalContext()
  const [tree] = $journal.$fileTree

  const deleteJournalModal = createLazyLoadedDialog()
  const [thingToDelete, setThingToDelete] = createSignal<JournalData>()

  $event.$on('journal__deletingJournal', (deleteRightAway, data) => {
    if (deleteRightAway) return

    setThingToDelete(data)
    deleteJournalModal.$show()
  })

  return (
    <div 
      {...props} 
      {...stylex.attrs(style.sidebar)} 
      editor-tour-sidebar
    >
      <SidebarButtonsRow />
      <Divider />
      <div
        {...stylex.attrs(style.content)} 
        app-scrollbar 
        app-scrollbar-vertical 
        app-invs-scrollbar
      >
        <For each={tree()}>
          {it => <Journal {...it} />}
        </For>
      </div>
      <deleteJournalModal.$Modal>
        <DeleteJournalModal 
          $close={deleteJournalModal.$close} 
          $journal={thingToDelete()!}
        />
      </deleteJournalModal.$Modal>
    </div>
  )
}