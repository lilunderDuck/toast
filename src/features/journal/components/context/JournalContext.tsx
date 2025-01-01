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
import type { JournalApi } from "~/api/journal"

export type JournalLocalStorage = IStorage<{
  shouldShowDeleteConfirmationModal: boolean
}>

export type JournalSessionStorage = IStorage<{
  currentGroup: JournalApi.IGroupData
}>

interface IJournalContext {
  $journal: IThisJournalContext
  $fileDisplay: IFileDisplayContext
  // ...
  $localStorage: JournalLocalStorage
  $sessionStorage: JournalSessionStorage
  $event: IEvent<JournalEventMap>
}

const Context = createContext<IJournalContext>()

export function JournalProvider(props: ParentProps) {
  const wrappedSessionStorage: JournalSessionStorage = createStorage(sessionStorage)
  const event = createEvent<JournalEventMap>()
  const fileDisplayContext = createFileDisplay(wrappedSessionStorage)
  const journalContext = createJournal(wrappedSessionStorage, fileDisplayContext)

  return (
    <Context.Provider value={{
      $journal: journalContext,
      $fileDisplay: fileDisplayContext,
      $localStorage: createStorage(localStorage),
      $sessionStorage: wrappedSessionStorage,
      $event: event
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalContext = () => useContext(Context)!