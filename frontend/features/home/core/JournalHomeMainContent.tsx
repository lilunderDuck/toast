import { lazy, Match, Switch } from "solid-js"
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"

import stylex from "@stylexjs/stylex"
import { AppTitleBarDraggable } from "~/components"

const style = stylex.create({
  titleBar: {
    width: "calc(100% - 35%)",
    position: "fixed",
    right: 0
  }
})

const Journal = lazy(() => import("../pages/Journal"))
const Playlist = lazy(() => import("../pages/Playlist"))

export function JournalHomeMainContent() {
  const { currentPage$ } = useJournalHomeRootContext()
  return (
    <>
      <AppTitleBarDraggable {...stylex.attrs(style.titleBar)} />
      <Switch>
        <Match when={currentPage$() === JournalPage.JOURNAL_HOME}>
          <Journal />
        </Match>

        <Match when={currentPage$() === JournalPage.PLAYLIST_HOME}>
          <Playlist />
        </Match>
      </Switch>
    </>
  )
}