import { Match, Show, Switch } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { AppTitleBarDraggable } from "~/components"
// ...
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"
import Journal from "../pages/Journal"
import Collection from "../pages/Collection"
import StickyNotes from "../pages/StickyNotes"
import { JournalHomeTitleBar } from "../components"

const titleBar = css`
  position: fixed;
  right: 0;
  gap: 10;
`

const titleBar__withSidebar = css`
  width: calc(100% - 35%);
`

const titleBar__noSidebar = css`
  width: "100%";
  padding-inline: 5;
`

export function JournalHomeMainContent() {
  const { currentPage$, isShowingSidebar$ } = useJournalHomeRootContext()
  return (
    <>
      <AppTitleBarDraggable class={`${titleBar} ${isShowingSidebar$() ? titleBar__withSidebar : titleBar__noSidebar}`}>
        <Show when={!isShowingSidebar$()}>
          <JournalHomeTitleBar />
        </Show>
      </AppTitleBarDraggable>
      <Switch>
        <Match when={currentPage$() === "journal_page$"}>
          <Journal />
        </Match>

        <Match when={currentPage$() === "collection_page$"}>
          <Collection />
        </Match>

        <Match when={currentPage$() === "sticky_note_page$"}>
          <StickyNotes />
        </Match>
      </Switch>
    </>
  )
}