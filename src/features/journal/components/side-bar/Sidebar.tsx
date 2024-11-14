import stylex from "@stylexjs/stylex"
import { For } from "solid-js"
// ...
import { Divider } from "~/components"
import type { JournalData } from "~/api"
// ...
import { useJournalContext } from "../../context"
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
  const { $tree, $event } = useJournalContext()
  const [tree] = $tree

  let lastJournalId = ''
  const clickingOnJournal = (data: JournalData) => () => {
    if (data.id === lastJournalId) return
    $event.$emit('journal__clickingJournal', data)
    lastJournalId = data.id
  }

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
          {it => <Journal {...it} onClick={clickingOnJournal(it)} />}
        </For>
      </div>
    </div>
  )
}