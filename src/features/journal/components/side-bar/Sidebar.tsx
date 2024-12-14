import stylex from "@stylexjs/stylex"
import { For, splitProps } from "solid-js"
// ...
import { Divider } from "~/components"
import type { JournalApi } from "~/api/journal"
// ...
import { useJournalContext } from "../../context"
import { SidebarButtonsRow } from "./SidebarButtonsRow"
import { Journal, IJournalProps, JournalCategory } from "./file-display"

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

export interface ISidebarProps extends HTMLAttributes<"div"> {
  $onClickingOpen?: (journal: JournalApi.JournalData) => void
  $onClickingRemove?: (journal: JournalApi.JournalData) => void
}

export function Sidebar(props: ISidebarProps) {
  const [, itsProps] = splitProps(props, ["$onClickingOpen", "$onClickingRemove"])
  const { $journal } = useJournalContext()
  const [tree] = $journal.$fileTree

  let lastJournalId: string | undefined
  const openOrRemoveJournal: IJournalProps["$onClick"] = (type, data) => {
    if (type === 'remove') {
      return props.$onClickingRemove?.(data)
    }

    const thisJournalId = data.id 
    if (thisJournalId === lastJournalId) return console.log(`No need to open journal, previous journal id: ${lastJournalId} - current journal id: ${thisJournalId}`)
    props.$onClickingOpen?.(data)
    lastJournalId = thisJournalId
  }

  return (
    <div 
      {...itsProps} 
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
        {/* <For each={tree()}>
          {it => <Journal {...it} $onClick={openOrRemoveJournal} />}
        </For> */}
        <Journal created={new Date()} id="2000" name="Test" $onClick={openOrRemoveJournal} />
        <JournalCategory created={new Date()} id="2000" name="Test 1">
          <Journal created={new Date()} id="2000" name="Test 2" $onClick={openOrRemoveJournal} />
          <Journal created={new Date()} id="2000" name="Test 3" $onClick={openOrRemoveJournal} />
          <JournalCategory created={new Date()} id="2000" name="Test 4"></JournalCategory>
        </JournalCategory>
      </div>
    </div>
  )
}