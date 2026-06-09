import { FaSolidBookOpenReader, FaSolidNoteSticky } from "solid-icons/fa"
import { RiMediaPlayList2Fill } from "solid-icons/ri"
import { For, Show } from "solid-js"
// ...
import { css } from "molcss"
import "./MainPageSidebar.css"
import { useMainPageContext, type IPageData } from "../provider/MainPageProvider"
import { MainPageTitlebar } from "../components"
// ...

const sidebar = css`
  height: 100%;
  flex-shrink: 0;
  padding-inline: 5px;
`

const sidebar__withSidebar = css`
  width: 35%;
  max-width: 24rem;
`

const sidebar__item = css`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  color: var(--subtext1);
  padding-inline: 10px;
  padding-block: 5px;
  user-select: none;
  margin-bottom: 5px;
`

const sidebar__titleBar = css`
  width: 100%;
  margin-bottom: 10px;
`

export function MainPageSidebar() {
  const { currentPage$, _setCurrentPage$, isShowingSidebar$ } = useMainPageContext()

  const SIDEBAR_ITEMS: IPageData[] = [
    {
      name$: "Notes",
      icon$: FaSolidBookOpenReader,
      pageId$: "notes_page$"
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
      <aside class={`${sidebar} ${isShowingSidebar$() ? sidebar__withSidebar : ''}`}>
        <MainPageTitlebar class={sidebar__titleBar} />
        <For each={SIDEBAR_ITEMS}>
          {it => (
            <button 
              onClick={() => _setCurrentPage$(it.pageId$)} 
              id={currentPage$() === it.pageId$ ? "homeSidebar__itemActive" : "homeSidebar__item"} 
              class={sidebar__item}
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