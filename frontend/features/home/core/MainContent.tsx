import { lazy, Match, Show, Switch } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { AppTitleBarDraggable } from "~/components"
import { CollectionPageProvider } from "~/features/collections"
import { StickyNotesProvider } from "~/features/sticky-notes"
import { NotePageProvider } from "~/features/notes"
// ...
import { useMainPageContext } from "../provider/MainPageProvider"
import { MainPageTitlebar } from "../components"

const titleBar = css`
  position: fixed;
  right: 0;
  gap: 10px;
`

const titleBar__withSidebar = css`
  width: calc(100% - 35%);
`

const titleBar__noSidebar = css`
  width: 100%;
  padding-inline: 5px;
`

const NotePage = lazy(() => import("~/features/notes"))
const CollectionPage = lazy(() => import("~/features/collections"))
const StickyNotesPage = lazy(() => import("~/features/sticky-notes"))

export function MainContent() {
  const { currentPage$, isShowingSidebar$ } = useMainPageContext()
  return (
    <>
      <AppTitleBarDraggable class={`${titleBar} ${isShowingSidebar$() ? titleBar__withSidebar : titleBar__noSidebar}`}>
        <Show when={!isShowingSidebar$()}>
          <MainPageTitlebar />
        </Show>
      </AppTitleBarDraggable>
      <Switch>
        <Match when={currentPage$() === "notes_page$"}>
          <NotePageProvider>
            <NotePage />
          </NotePageProvider>
        </Match>

        <Match when={currentPage$() === "collection_page$"}>
          <CollectionPageProvider>
            <CollectionPage />
          </CollectionPageProvider>
        </Match>

        <Match when={currentPage$() === "sticky_note_page$"}>
          <StickyNotesProvider>
            <StickyNotesPage />
          </StickyNotesProvider>
        </Match>
      </Switch>
    </>
  )
}