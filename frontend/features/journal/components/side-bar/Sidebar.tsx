import { type ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from'~/assets/style/scrollbar.module.css'
// ...
import { Divider } from "~/components"
import { mergeClassname } from "~/utils"
import { useFileDisplayContext } from "~/features/file-display"
// ...
import { SidebarButtonsRow } from "./SidebarButtonsRow"
import SidebarActions from "./SidebarActions"
import { useJournalContext } from "../../context"
import { createFileNodeData, createFolderNodeData } from "../../utils"
import { JournalType } from "~/api/journal"

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

export function Sidebar(props: ParentProps) {
  const { event$ } = useJournalContext()
  const { add$ } = useFileDisplayContext()

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

    add$(createNode(data.id), "root", data)
  })

  return (
    <div 
      {...stylex.attrs(style.sidebar)} 
    >
      <SidebarButtonsRow />
      <Divider />
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