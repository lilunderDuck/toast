import { 
  createContext, 
  type ParentProps, 
  useContext 
} from "solid-js"
import { createEvent, createStorage, type IEvent, type IStorage } from "~/utils"
// ...
import { type JournalEventMap } from "./event"
import { createJournal, type IThisJournalContext } from "./journal"
import { type IFileDisplayContext, createFileDisplay } from "./fileDisplayContext"

interface IJournalContext {
  $journal: IThisJournalContext
  $fileDisplay: IFileDisplayContext
  // ...
  $localStorage: IStorage<{
    shouldShowDeleteConfirmationModal: boolean
  }>
  $event: IEvent<JournalEventMap>
}

const Context = createContext<IJournalContext>()

export function JournalProvider(props: ParentProps) {
  const event = createEvent<JournalEventMap>()
  const fileDisplayContext = createFileDisplay()
  const journalContext = createJournal(fileDisplayContext)

  return (
    <Context.Provider value={{
      $journal: journalContext,
      $fileDisplay: fileDisplayContext,
      $localStorage: createStorage(localStorage),
      $event: event
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalContext = () => useContext(Context)!