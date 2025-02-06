import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
// ...
import type { IJournalGroupData } from "~/api/journal"
import { thisArrayObjects } from "~/common"
import { createEvent, type IEvent } from "~/utils"
// ...
import { api_getGroup } from "../utils"

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
          console.log('[home > sidebar] opened', data)
        },
        close$() {
          setCurrentJournalData(undefined)
          event.emit$('home__infoSidebarClose')
          console.log('[home > sidebar] closed')
        },
        update$(data: IJournalGroupData) {
          setCurrentJournalData(data)
          console.log('[home > sidebar] updated', data)
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
          console.log('[home > grid] added', another)
        },
        update$(newOne) {
          setJournalGroups(prev => [...thisArrayObjects(prev).replace$(it => it.id === newOne.id, newOne)])
          console.log('[home > grid] updated', newOne)
        }
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalHomeContext = () => useContext(Context)!