import { BiSolidNote } from "solid-icons/bi"
import { RiMediaPlayList2Fill } from "solid-icons/ri"
import { For, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import "./JournalHomeSidebar.css"
// ...
import { AppTitleBarDraggable } from "~/components"
// ...
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"
import { JournalHomeTitleBarIcon, ToggleHideSidebarButton } from "../components"

const style = stylex.create({
  sidebar: {
    height: "100%",
    flexShrink: 0,
    paddingInline: 5,
  },
  sidebar__withSidebar: {
    width: "35%",
  },
  sidebar__noSidebar: {
    // ...
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
    marginBottom: 5,
  },
  sidebar__titleBar: {
    width: "100%",
    marginBottom: 10,
    gap: 10
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
  const { currentPage$, _setCurrentPage$, isShowingSidebar$ } = useJournalHomeRootContext()

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
    <Show when={isShowingSidebar$()}>
      <aside class={`${stylex.attrs(style.sidebar).class} ${isShowingSidebar$() ? stylex.attrs(style.sidebar__withSidebar).class : stylex.attrs(style.sidebar__noSidebar).class}`}>
        <AppTitleBarDraggable {...stylex.attrs(style.sidebar__titleBar)}>
          <JournalHomeTitleBarIcon />
          <ToggleHideSidebarButton />
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
    </Show>
  )
}