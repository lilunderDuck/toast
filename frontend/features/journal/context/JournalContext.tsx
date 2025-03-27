import { 
  createContext, 
  onCleanup, 
  type ParentProps, 
  useContext, 
} from "solid-js"
// ...
import { createEvent, createStorage, type IEvent, type IStorage } from "~/utils"
import type { IJournalGroupData } from "~/api/journal"
import { journalLog } from "~/features/debug"
// ...
import { type JournalEventMap } from "./event"
import { createJournal, type IJournalUtils } from "./journal"
import { type IFileDisplayContext, createFileDisplay } from "./fileDisplay"

export type JournalLocalStorage = IStorage<{
  shouldShowDeleteConfirmationModal: boolean
  [key: `readonly-${string}`]: boolean
}>

export type JournalSessionStorage = IStorage<{
  currentGroup: IJournalGroupData
}>

interface IJournalContext {
  journal$: IJournalUtils
  fileDisplay$: IFileDisplayContext
  // ...
  localStorage$: JournalLocalStorage
  sessionStorage$: JournalSessionStorage
  event$: IEvent<JournalEventMap>
  // ...
  getCurrentGroup$(): IJournalGroupData
}

const Context = createContext<IJournalContext>()

export function JournalProvider(props: ParentProps) {
  const wrappedSessionStorage: JournalSessionStorage = createStorage(sessionStorage)
  const event = createEvent<JournalEventMap>()
  const fileDisplayContext = createFileDisplay(wrappedSessionStorage)
  const journalContext = createJournal(wrappedSessionStorage, fileDisplayContext)

  onCleanup(() => {
    wrappedSessionStorage.delete$("currentGroup")
    //debug-start
    journalLog.log('clean up')
    //debug-end
  })

  //debug-start
  journalLog.log('created')
  //debug-end

  return (
    <Context.Provider value={{
      journal$: journalContext,
      fileDisplay$: fileDisplayContext,
      // ...
      localStorage$: createStorage(localStorage),
      sessionStorage$: wrappedSessionStorage,
      event$: event,
      getCurrentGroup$() {
        const currentGroup = wrappedSessionStorage.get$('currentGroup')
        console.assert(currentGroup, '[panic] currentGroup data should NOT be null or undefined')

        return currentGroup
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalContext = () => useContext(Context)!