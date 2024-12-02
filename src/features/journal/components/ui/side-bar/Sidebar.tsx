import stylex from "@stylexjs/stylex"
import { For } from "solid-js"
// ...
import { Divider } from "~/components"
// ...
import { useJournalContext } from "../../../context"
import { SidebarButtonsRow } from "./SidebarButtonsRow"
import { Journal } from "./file-display"

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
  const { $journal } = useJournalContext()
  const [tree] = $journal.$fileTree

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
    </div>
  )
}