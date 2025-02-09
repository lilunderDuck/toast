import { splitProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { Divider } from "~/components"
import type { IJournalData } from "~/api/journal"
// ...
import { SidebarButtonsRow } from "./SidebarButtonsRow"
import { mergeClassname } from "~/utils"
import { FileDisplay } from "./file-display"

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
  onClickingOpen$?: (journal: IJournalData) => void
  on$ClickingRemove?: (journal: IJournalData) => void
}

export function Sidebar(props: ISidebarProps) {
  const [, itsProps] = splitProps(props, ["onClickingOpen$", "on$ClickingRemove"])

  return (
    <div 
      {...itsProps} 
      {...stylex.attrs(style.sidebar)} 
      editor-tour-sidebar
    >
      <SidebarButtonsRow />
      <Divider />
      <div class={mergeClassname(
        __scrollbarStyle.scrollbar,
        __scrollbarStyle.scrollbarVertical,
        __scrollbarStyle.invsScrollbar,
        stylex.attrs(style.content)
      )}>
        <FileDisplay />
      </div>
    </div>
  )
}