import { lazy, Match, Switch } from "solid-js"
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"

const Journal = lazy(() => import("../pages/Journal"))

export function JournalHomeMainContent() {
  const { currentPage$ } = useJournalHomeRootContext()
  return (
    <Switch>
      <Match when={currentPage$() === JournalPage.JOURNAL_HOME}>
        <Journal />
      </Match>
    </Switch>
  )
}