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
import { createTab, ITabUtils } from "./tabs"

export type JournalLocalStorage = IStorage<{
  shouldShowDeleteConfirmationModal: boolean
  [key: `readonly-${string}`]: boolean
}>

export type JournalSessionStorage = IStorage<{
  currentGroup: IJournalGroupData
}>

interface IJournalProviderProps {
  // ...
}

interface IJournalContext {
  journal$: IJournalUtils
  tabs$: ITabUtils
  // ...
  localStorage$: JournalLocalStorage
  sessionStorage$: JournalSessionStorage
  event$: IEvent<JournalEventMap>
  // ...
  getCurrentGroup$(): IJournalGroupData
}

const Context = createContext<IJournalContext>()

export function JournalProvider(props: ParentProps<IJournalProviderProps>) {
  const getCurrentGroup = () => {
    const currentGroup = wrappedSessionStorage.get$('currentGroup')
    console.assert(currentGroup, '[panic] currentGroup data should NOT be null or undefined')

    return currentGroup
  }

  const getCurrentGroupId = () => getCurrentGroup().id

  const wrappedSessionStorage: JournalSessionStorage = createStorage(sessionStorage, 'journal')
  const event = createEvent<JournalEventMap>()
  const journalContext = createJournal(getCurrentGroupId, event)
  const tabContext = createTab(getCurrentGroupId)

  onCleanup(() => {
    wrappedSessionStorage.delete$("currentGroup")
    isDevMode && journalLog.log('clean up')
  })

  isDevMode && journalLog.log('created')

  return (
    <Context.Provider value={{
      journal$: journalContext,
      tabs$: tabContext,
      // ...
      localStorage$: createStorage(localStorage, 'journal'),
      sessionStorage$: wrappedSessionStorage,
      event$: event,
      getCurrentGroup$: getCurrentGroup
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalContext = () => useContext(Context)!