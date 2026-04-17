import stylex from "@stylexjs/stylex"
import { For } from "solid-js"
import "./JournalHomeSidebar.css"
import { AppTitleBarDraggable } from "~/components"
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"
import { BiSolidNote } from "solid-icons/bi"
import { RiMediaPlayList2Fill } from "solid-icons/ri"

const style = stylex.create({
  sidebar: {
    width: "35%",
    height: "100%",
    flexShrink: 0,
    paddingInline: 5,
  },
  sidebar__item: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    width: "100%",
    color: "var(--subtext1)",
    paddingInline: 10,
    paddingBlock: 5,
    userSelect: "none",
    marginBottom: 5
  },
  sidebar__titleBar: {
    width: "100%",
  },
})

export function JournalHomeSidebar() {
  const { currentPage$, _setCurrentPage$ } = useJournalHomeRootContext()

  const SIDEBAR_ITEMS = [
    {
      name$: "Journal",
      icon$: BiSolidNote,
      pageId$: JournalPage.JOURNAL_HOME
    },
    {
      name$: "Playlist",
      icon$: RiMediaPlayList2Fill,
      pageId$: JournalPage.COLLECTION_HOME
    }
  ]

  return (
    <aside {...stylex.attrs(style.sidebar)}>
      <AppTitleBarDraggable {...stylex.attrs(style.sidebar__titleBar)} />
      <For each={SIDEBAR_ITEMS}>
        {it => (
          <button 
            onClick={() => _setCurrentPage$(it.pageId$)} 
            id={currentPage$() === it.pageId$ ? "homeSidebar__itemActive" : "homeSidebar__item"} 
            {...stylex.attrs(style.sidebar__item)}
          >
            <it.icon$ />
            {it.name$}
          </button>
        )}
      </For>
    </aside>
  )
}