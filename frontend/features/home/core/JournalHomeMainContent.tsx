import { Match, Show, Switch } from "solid-js"
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"

import stylex from "@stylexjs/stylex"
import { AppTitleBarDraggable } from "~/components"
import Journal from "../pages/Journal"
import Collection from "../pages/Collection"
import { JournalHomeTitleBarIcon, ToggleHideSidebarButton } from "../components"
import { CLS } from "macro-def"

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
          <JournalHomeTitleBarIcon />
          <ToggleHideSidebarButton />
        </Show>
      </AppTitleBarDraggable>
      <Switch>
        <Match when={currentPage$() === JournalPage.JOURNAL_HOME}>
          <Journal />
        </Match>

        <Match when={currentPage$() === JournalPage.COLLECTION_HOME}>
          <Collection />
        </Match>
      </Switch>
    </>
  )
}