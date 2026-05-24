import { Match, Show, Switch } from "solid-js"
import { CLS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { AppTitleBarDraggable } from "~/components"
// ...
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"
import Journal from "../pages/Journal"
import Collection from "../pages/Collection"
import StickyNotes from "../pages/StickyNotes"
import { JournalHomeTitleBar } from "../components"

const style = stylex.create({
  titleBar: {
    position: "fixed",
    right: 0,
    gap: 10
  },
  titleBar__withSidebar: {
    width: "calc(100% - 35%)",
  },
  titleBar__noSidebar: {
    width: "100%",
    paddingInline: 5
  }
})

export function JournalHomeMainContent() {
  const { currentPage$, isShowingSidebar$ } = useJournalHomeRootContext()
  return (
    <>
      <AppTitleBarDraggable class={`${CLS(style.titleBar)} ${isShowingSidebar$() ? CLS(style.titleBar__withSidebar) : CLS(style.titleBar__noSidebar)}`}>
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