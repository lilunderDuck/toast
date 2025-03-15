import { Accessor, createSignal } from "solid-js";
// ...
import { IJournalGroupData } from "~/api/journal";
import { IEvent } from "~/utils";
import { homeLog } from "~/features/debug";
// ...
import { JournalHomeEvent } from "./JournalHomeProvider"

export interface IInfoSidebarUtils {
  open$(data: IJournalGroupData): void
  close$(): void
  update$(data: IJournalGroupData): void
  currentJournalData$: Accessor<IJournalGroupData | undefined>,
}

export function createInfoSidebar(event: IEvent<JournalHomeEvent>): IInfoSidebarUtils {
  const [currentJournalData, setCurrentJournalData] = createSignal<IJournalGroupData>()

  return {
    open$(data) {
      setCurrentJournalData(data)
      //debug-start
      homeLog.logLabel('sidebar', 'opened', data)
      //debug-end
    },
    close$() {
      setCurrentJournalData(undefined)
      event.emit$('home__infoSidebarClose')
      //debug-start
      homeLog.logLabel('sidebar', 'closed')
      //debug-end
    },
    update$(data) {
      setCurrentJournalData(data)
      //debug-start
      homeLog.logLabel('sidebar', 'updated', data)
      //debug-end
    },
    currentJournalData$: currentJournalData,
  }
}