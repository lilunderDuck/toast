import { Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
import { JOURNAL_GROUP_ROUTE, JournalApi } from "~/api/journal"
import { thisArrayObjects } from "~/common"
import { createEvent, fetchIt, type IEvent } from "~/utils"

type JournalHomeEvent = {
  home__infoSidebarClose(): void
}

interface IJournalHomeContext {
  $infoSidebar: {
    $open(data: JournalApi.GroupData): void
    $close(): void
    $update(data: JournalApi.GroupData): void
    $currentJournalData: Accessor<JournalApi.GroupData | undefined>
  }
  $grid: {
    $fetchJournalGroups(): Promise<JournalApi.GroupData[]>
    $journalGroups: Accessor<JournalApi.GroupData[]>
    $add(data: JournalApi.GroupData): void
    $update(data: JournalApi.GroupData): void
  }
  // ...
  $event: IEvent<JournalHomeEvent>
}

const Context = createContext<IJournalHomeContext>()

export function JournalHomeProvider(props: ParentProps) {
  const [journalGroups, setJournalGroups] = createSignal<JournalApi.GroupData[]>([])
  const [currentJournalData, setCurrentJournalData] = createSignal<JournalApi.GroupData>()

  const event = createEvent<JournalHomeEvent>()

  return (
    <Context.Provider value={{
      $event: event,
      $infoSidebar: {
        $open(data: JournalApi.GroupData) {
          setCurrentJournalData(data)
          console.log('[home > sidebar] opened', data)
        },
        $close() {
          setCurrentJournalData(undefined)
          event.$emit('home__infoSidebarClose')
          console.log('[home > sidebar] closed')
        },
        $update(data: JournalApi.GroupData) {
          setCurrentJournalData(data)
          console.log('[home > sidebar] updated', data)
        },
        $currentJournalData: currentJournalData,
      },
      $grid: {
        async $fetchJournalGroups() {
          const data = await fetchIt<JournalApi.GroupData[]>('GET', JOURNAL_GROUP_ROUTE) ?? []
          setJournalGroups(data)
          return data
        },
        $journalGroups: journalGroups,
        $add(another) {
          setJournalGroups(prev => [...prev, another])
          console.log('[home > grid] added', another)
        },
        $update(newOne) {
          setJournalGroups(prev => [...thisArrayObjects(prev).$replace(it => it.id === newOne.id, newOne)])
          console.log('[home > grid] updated', newOne)
        }
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalHomeContext = () => useContext(Context)!