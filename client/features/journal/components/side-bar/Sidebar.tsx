import { Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { Divider } from "~/components"
import { mergeClassname } from "~/utils"
// ...
import { SidebarButtonsRow } from "./SidebarButtonsRow"
import { FileDisplay, FileDisplaySkeleton } from "./file-display"
import SidebarActions from "./SidebarActions"
import { useJournalContext } from "../../context"

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

export function Sidebar() {
  const { fileDisplay$ } = useJournalContext()
  const [isLoading] = fileDisplay$.isLoading$

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
        <Show when={!isLoading()} fallback={<FileDisplaySkeleton />}>
          <FileDisplay />
        </Show>
      </div>

      <SidebarActions />
    </div>
  )
}