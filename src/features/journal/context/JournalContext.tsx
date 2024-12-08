import { 
  createContext, 
  type ParentProps, 
  useContext 
} from "solid-js"
import { createEvent, createStorage, type IEvent, type IStorage } from "~/utils"
// ...
import { JournalEventMap } from "./event"
import { createJournal, IThisJournalContext } from "./journal"

interface IJournalContext {
  $journal: IThisJournalContext
  // ...
  $localStorage: IStorage<{
    shouldShowDeleteConfirmationModal: boolean
  }>
  $event: IEvent<JournalEventMap>
}

const Context = createContext<IJournalContext>()

export function JournalProvider(props: ParentProps) {
  const event = createEvent<JournalEventMap>()

  return (
    <Context.Provider value={{
      $journal: createJournal(),
      $localStorage: createStorage(localStorage),
      $event: event
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalContext = () => useContext(Context)!