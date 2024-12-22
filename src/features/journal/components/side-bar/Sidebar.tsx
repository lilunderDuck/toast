import { splitProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { Divider } from "~/components"
import type { JournalApi } from "~/api/journal"
import { mergeClassname } from "~/utils"
import { FileDisplayProvider, FileDisplay } from "~/features/file-display"
// ...
import { useJournalContext } from "../../context"
import { SidebarButtonsRow } from "./SidebarButtonsRow"

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
  $onClickingOpen?: (journal: JournalApi.IJournalData) => void
  $onClickingRemove?: (journal: JournalApi.IJournalData) => void
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
      <FileDisplayProvider>
        <div class={mergeClassname(
          __scrollbarStyle.scrollbar,
          __scrollbarStyle.scrollbarVertical,
          __scrollbarStyle.invsScrollbar,
          stylex.attrs(style.content)
        )}>
          <FileDisplay />
        </div>
      </FileDisplayProvider>
    </div>
  )
}