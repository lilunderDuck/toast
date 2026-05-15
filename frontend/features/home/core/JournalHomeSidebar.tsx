import { BiSolidNote } from "solid-icons/bi"
import { RiMediaPlayList2Fill } from "solid-icons/ri"
import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import "./JournalHomeSidebar.css"
import toastIcon from "~/assets/toast.jpg"
// ...
import { AppTitleBarDraggable } from "~/components"
// ...
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"

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
    marginBottom: 10
  },
  sidebar__titleBarIcon: {
    width: "calc(var(--title-bar-thiccness) - 6px)",
    height: "calc(var(--title-bar-thiccness) - 6px)",
    background: "center center no-repeat var(--icon)",
    backgroundSize: "cover",
    borderRadius: "50%",
    marginLeft: 10
  }
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
      <AppTitleBarDraggable {...stylex.attrs(style.sidebar__titleBar)}>
        <div 
          {...stylex.attrs(style.sidebar__titleBarIcon)}  
          style={`--icon:url("${toastIcon}")`}
        />
      </AppTitleBarDraggable>
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