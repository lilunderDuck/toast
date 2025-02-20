import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
// ...
import { type IJournalGroupData, api_getGroup } from "~/api/journal"
import { thisArrayObjects } from "~/common"
import { createEvent, type IEvent } from "~/utils"
// ...
import { home_logWithLabel } from "../utils"

type JournalHomeEvent = {
  home__infoSidebarClose(): void
}

interface IJournalHomeContext {
  infoSidebar$: {
    open$(data: IJournalGroupData): void
    close$(): void
    update$(data: IJournalGroupData): void
    currentJournalData$: Accessor<IJournalGroupData | undefined>
  }
  grid$: {
    fetchJournalGroups$(): Promise<IJournalGroupData[]>
    journalGroups$: Accessor<IJournalGroupData[]>
    add$(data: IJournalGroupData): void
    update$(data: IJournalGroupData): void
  }
  // ...
  event$: IEvent<JournalHomeEvent>
}

const Context = createContext<IJournalHomeContext>()

export function JournalHomeProvider(props: ParentProps) {
  const [journalGroups, setJournalGroups] = createSignal<IJournalGroupData[]>([])
  const [currentJournalData, setCurrentJournalData] = createSignal<IJournalGroupData>()

  const event = createEvent<JournalHomeEvent>()

  return (
    <Context.Provider value={{
      event$: event,
      infoSidebar$: {
        open$(data: IJournalGroupData) {
          setCurrentJournalData(data)
          //debug-start
          home_logWithLabel('sidebar', 'opened', data)
          //debug-end
        },
        close$() {
          setCurrentJournalData(undefined)
          event.emit$('home__infoSidebarClose')
          //debug-start
          home_logWithLabel('sidebar', 'closed')
          //debug-end
        },
        update$(data: IJournalGroupData) {
          setCurrentJournalData(data)
          //debug-start
          home_logWithLabel('sidebar', 'updated', data)
          //debug-end
        },
        currentJournalData$: currentJournalData,
      },
      grid$: {
        async fetchJournalGroups$() {
          const data = await api_getGroup<undefined>()
          setJournalGroups(data)
          return data
        },
        journalGroups$: journalGroups,
        add$(another) {
          setJournalGroups(prev => [...prev, another])
          //debug-start
          home_logWithLabel('grid', 'added', another)
          //debug-end
        },
        update$(newOne) {
          setJournalGroups(prev => [...thisArrayObjects(prev).replace$(it => it.id === newOne.id, newOne)])
          //debug-start
          home_logWithLabel('grid', 'updated', newOne)
          //debug-end
        }
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalHomeContext = () => useContext(Context)!