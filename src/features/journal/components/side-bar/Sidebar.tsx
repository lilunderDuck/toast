import stylex from "@stylexjs/stylex"
import { For, splitProps } from "solid-js"
// ...
import { Divider } from "~/components"
import type { JournalApi } from "~/api/journal"
// ...
import { useJournalContext } from "../../context"
import { SidebarButtonsRow } from "./SidebarButtonsRow"
import { Journal, IJournalProps } from "./file-display"

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

    const thisJournalId = props.id 
    if (thisJournalId === lastJournalId) return console.log('No need to open the journal')
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
        <For each={tree()}>
          {it => <Journal {...it} $onClick={openOrRemoveJournal} />}
        </For>
      </div>
    </div>
  )
}