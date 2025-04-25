import { type ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from'~/assets/style/scrollbar.module.css'
// ...
import { mergeClassname } from "~/utils"
import { createFileNodeData, createFolderNodeData, useFileDisplayContext } from "~/features/file-display"
import { JournalType } from "~/api/journal"
// ...
import SidebarActions from "./SidebarActions"
import { useJournalContext } from "../../context"

const style = stylex.create({
  sidebar: {
    width: '100%',
    paddingInline: 5,
    paddingTop: 5
  },
  content: {
    height: 'calc(100vh - var(--journal-header))'
  }
})

export function Sidebar(props: ParentProps) {
  const { event$ } = useJournalContext()
  const { add$, getCurrentlySelectedFolderNodeId$ } = useFileDisplayContext()

  event$.on$("journal__createdJournal$", (type, data) => {
    let createNode
    switch(type) {
      case JournalType.journal:
        createNode = createFileNodeData
      break

      case JournalType.category:
        createNode = createFolderNodeData
      break
    }

    const selectedFolderId = getCurrentlySelectedFolderNodeId$()
    add$(createNode(data.id), selectedFolderId === -1 ? "root" : selectedFolderId, data)
  })

  return (
    <div {...stylex.attrs(style.sidebar)}>
      <div class={mergeClassname(
        __scrollbarStyle.scrollbar,
        __scrollbarStyle.scrollbarVertical,
        __scrollbarStyle.invsScrollbar,
        stylex.attrs(style.content)
      )}>
        {props.children}
      </div>

      <SidebarActions />
    </div>
  )
}