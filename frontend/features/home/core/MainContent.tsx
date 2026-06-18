import { Match, Show, Switch } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { AppTitleBarDraggable } from "~/components"
// ...
import { useMainPageContext } from "../provider/MainPageProvider"
import { CollectionPageProvider } from "../provider/CollectionPageProvider"
import { NoteHomeProvider } from "../provider/NoteHomeProvider"
import { StickyNotesProvider } from "../provider/StickyNotesProvider"
import Note from "../pages/Note"
import Collection from "../pages/Collection"
import StickyNotes from "../pages/StickyNotes"
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
          <NoteHomeProvider>
            <Note />
          </NoteHomeProvider>
        </Match>

        <Match when={currentPage$() === "collection_page$"}>
          <CollectionPageProvider>
            <Collection />
          </CollectionPageProvider>
        </Match>

        <Match when={currentPage$() === "sticky_note_page$"}>
          <StickyNotesProvider>
            <StickyNotes />
          </StickyNotesProvider>
        </Match>
      </Switch>
    </>
  )
}