import { 
  createContext, 
  type ParentProps, 
  useContext 
} from "solid-js"
import { createStorage, type IEvent, type IStorage } from "~/utils"
// ...
import { $event, JournalEventMap } from "./event"
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
  return (
    <Context.Provider value={{
      $journal: createJournal(),
      $localStorage: createStorage(localStorage),
      $event
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalContext = () => useContext(Context)!