import stylex from "@stylexjs/stylex"
import { useJournalContext } from "../context"
import { Show } from "solid-js"

const style = stylex.create({
  sidebar: {
    width: '35%'
  },
  titleBar: {
    paddingInline: 5
  }
})

export function JournalRightSidebar() {
  const { _sidebarComponent$, isShowingSidebar$ } = useJournalContext()
  const [isShowingSidebar] = isShowingSidebar$

  return (
    <Show when={isShowingSidebar()}>
      <div {...stylex.attrs(style.sidebar)}>
        <_sidebarComponent$ />
      </div>
    </Show>
  )
}