import { 
  createContext, 
  createSignal, 
  onCleanup, 
  type ParentProps, 
  type Signal, 
  useContext, 
  type VoidComponent
} from "solid-js"
// ...
import { createEvent, createStorage, type IEvent, type IStorage } from "~/utils"
import type { IJournalGroupData } from "~/api/journal"
// ...
import { type JournalEventMap } from "./event"
import { createJournal, type IThisJournalContext } from "./journal"
import { type IFileDisplayContext, createFileDisplay } from "./fileDisplay"
import { journalLog } from "../utils"

export type JournalLocalStorage = IStorage<{
  shouldShowDeleteConfirmationModal: boolean
  [key: `readonly-${string}`]: boolean
}>

export type JournalSessionStorage = IStorage<{
  currentGroup: IJournalGroupData
}>

interface IJournalContext {
  journal$: IThisJournalContext
  fileDisplay$: IFileDisplayContext
  // ...
  localStorage$: JournalLocalStorage
  sessionStorage$: JournalSessionStorage
  event$: IEvent<JournalEventMap>
  // ...
  _sidebarComponent$: VoidComponent
  isShowingSidebar$: Signal<boolean>
  openSidebar$(sidebarComponent: VoidComponent): void
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

  let sidebarComponent: VoidComponent = () => undefined
  const [isShowingSidebar, setIsShowingSidebar] = createSignal(false)

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
      // ...
      get _sidebarComponent$() {
        return sidebarComponent
      },
      isShowingSidebar$: [isShowingSidebar, setIsShowingSidebar],
      openSidebar$(thisSidebarComponent) {
        sidebarComponent = thisSidebarComponent
        setIsShowingSidebar(true)
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalContext = () => useContext(Context)!