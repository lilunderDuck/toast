import { 
  type Accessor, 
  createContext, 
  createSignal, 
  type ParentProps, 
  type Setter, 
  type Signal, 
  useContext 
} from "solid-js"
import { JournalData, JournalGroupData } from "~/api"
import type { IEvent } from "~/utils"
import { $event, JournalEventMap } from "./event"

const Context = createContext<{
  $currentlyOpenedJournal: Accessor<JournalData | undefined>
  $setCurrentlyOpenedJournal: Setter<JournalData | undefined>
  $currentGroup: Accessor<JournalGroupData | undefined>
  $setCurrentGroup: Setter<JournalGroupData | undefined>
  // ...
  $tree: Signal<JournalData[]>
  $event: IEvent<JournalEventMap>
}>()

export function JournalProvider(props: ParentProps) {
  const [$currentlyOpenedJournal, $setCurrentlyOpenedJournal] = createSignal<JournalData>()
  const [$currentGroup, $setCurrentGroup] = createSignal<JournalGroupData>()

  return (
    <Context.Provider value={{
      $currentlyOpenedJournal, 
      $setCurrentlyOpenedJournal,
      $currentGroup,
      $setCurrentGroup,
      $tree: createSignal([] as JournalData[]),
      $event
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalContext = () => useContext(Context)!