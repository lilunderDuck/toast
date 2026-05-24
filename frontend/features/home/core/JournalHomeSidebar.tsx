import { FaSolidBookOpenReader, FaSolidNoteSticky } from "solid-icons/fa"
import { RiMediaPlayList2Fill } from "solid-icons/ri"
import { For, Show } from "solid-js"
import { CLS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import "./JournalHomeSidebar.css"
// ...
import { useJournalHomeRootContext, type IJournalHomePageData } from "../provider/JournalHomeRootProvider"
import { JournalHomeTitleBar } from "../components"

const style = stylex.create({
  sidebar: {
    height: "100%",
    flexShrink: 0,
    paddingInline: 5,
  },
  sidebar__withSidebar: {
    width: "35%",
    maxWidth: "24rem"
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

  const SIDEBAR_ITEMS: IJournalHomePageData[] = [
    {
      name$: "Journal",
      icon$: FaSolidBookOpenReader,
      pageId$: "journal_page$"
    },
    {
      name$: "Sticky notes",
      icon$: FaSolidNoteSticky,
      pageId$: "sticky_note_page$"
    },
    {
      name$: "Collection",
      icon$: RiMediaPlayList2Fill,
      pageId$: "collection_page$"
    },
  ]

  return (
    <Show when={isShowingSidebar$()}>
      <aside class={`${CLS(style.sidebar)} ${isShowingSidebar$() ? CLS(style.sidebar__withSidebar) : CLS(style.sidebar__noSidebar)}`}>
        <JournalHomeTitleBar {...stylex.attrs(style.sidebar__titleBar)} />
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