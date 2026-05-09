import { type Accessor, createContext, type ParentProps, useContext } from "solid-js"
// ...
import __style from "./[groupId].module.css"
// ...
import { createStorage, type IStorage } from "~/utils"
import { useToggle } from "~/hooks"
// ...
import { createHistoryManager, type IHistoryManager } from "./history"

export type JournalSessionStorage = IStorage<{
  journal_data$: {
    groupId$: string
  }
  sidebar_hidden$: boolean
  [key: `explorer.${number}`]: boolean
}>

export type JournalLocalStorage = IStorage<{
  last_opened$: null
}>

export interface IJournalContext {
  createJournal$(type: number, data: null): Promise<null>
  getJournal$(journalId: string): Promise<null>
  updateJournal$(journalId: string, newData: null): Promise<void>
  // ...
  sessionStorage$: JournalSessionStorage
  history$: IHistoryManager
  sidebar$: {
    toggle$: () => boolean
    isHidden$: Accessor<boolean>
  }
}

export interface IJournalProviderProps {
}

const Context = createContext<IJournalContext>()

export function JournalProvider(props: ParentProps<IJournalProviderProps>) {
  const wrappedSessionStorage: IJournalContext["sessionStorage$"] = createStorage(sessionStorage, "journal$")
  const wrappedLocalStorage: JournalLocalStorage = createStorage(sessionStorage, "j"/*journal*/)
  const groupId = () => wrappedSessionStorage.get$('journal_data$').groupId$

  const createJournal: IJournalContext["createJournal$"] = async (type, data) => {
    return null
  }

  const [isSidebarHidden, toggleHideSidebar] = useToggle()

  return (
    <Context.Provider value={{
      sidebar$: {
        isHidden$: isSidebarHidden,
        toggle$: toggleHideSidebar
      },
      sessionStorage$: wrappedSessionStorage,
      createJournal$: createJournal,
      getJournal$: (journalId) => {},
      updateJournal$: (journalId, newData) => {},
      history$: createHistoryManager(wrappedLocalStorage)
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useJournalContext() {
  return useContext(Context)!
}