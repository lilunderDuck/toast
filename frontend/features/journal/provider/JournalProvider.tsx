import { type Accessor, createContext, createSignal, type ParentProps, type Setter, useContext } from "solid-js"
// ...
import { createStorage, type IStorage } from "~/utils"
import { CreateJournal, GetJournal, UpdateJournal } from "~/wailsjs/go/journal/GroupExport"
import type { journal } from "~/wailsjs/go/models"
// ...
import { createFileExplorerContext, createFileNode, createFolderNode, type IFileExplorerContext, type IFileExplorerProviderOptions, ROOT_FOLDER } from "./explorer"
import { createHistoryManager, type IHistoryManager } from "./history"

export type JournalSessionStorage = IStorage<{
  journal_data$: {
    groupId$: number
  }
  sidebar_hidden$: boolean
  [key: `explorer.${number}`]: boolean
}>

export type JournalLocalStorage = IStorage<{
  last_opened$: journal.JournalData | null
}>

export interface IJournalContext {
  createJournal$(type: number, data: journal.JournalOptions): Promise<journal.JournalData>
  getJournal$(journalId: number): Promise<journal.JournalData>
  updateJournal$(journalId: number, newData: journal.JournalOptions): Promise<journal.JournalData>
  // ...
  sessionStorage$: JournalSessionStorage
  explorerTree$: IFileExplorerContext
  history$: IHistoryManager
  // ...
  currentlyOpenedJournal$: Accessor<string | undefined>
  setCurrentlyOpenedJournal$: Setter<string | undefined>
}

export interface IJournalProviderProps {
  explorerOptions$: IFileExplorerProviderOptions
}

const Context = createContext<IJournalContext>()

export function JournalProvider(props: ParentProps<IJournalProviderProps>) {
  const wrappedSessionStorage: IJournalContext["sessionStorage$"] = createStorage(sessionStorage, "journal$")
  const wrappedLocalStorage: JournalLocalStorage = createStorage(sessionStorage, "j"/*journal*/)
  const groupId = () => wrappedSessionStorage.get$('journal_data$').groupId$

  const explorerTree = createFileExplorerContext(props.explorerOptions$)
  const [currentlyOpenedJournal, setCurrentlyOpenedJournal] = createSignal<string>()

  const createJournal: IJournalContext["createJournal$"] = async (type, data) => {
    const newData = await CreateJournal(groupId(), type, data)
    const explorerNode = (type == 1 ? createFolderNode : createFileNode)(newData.id)
    // @ts-ignore
    explorerTree.tree$.create$(explorerNode, ROOT_FOLDER, newData)
    return newData
  }

  return (
    <Context.Provider value={{
      currentlyOpenedJournal$: currentlyOpenedJournal,
      setCurrentlyOpenedJournal$: setCurrentlyOpenedJournal,
      // ...
      explorerTree$: explorerTree,
      sessionStorage$: wrappedSessionStorage,
      createJournal$: createJournal,
      getJournal$: (journalId) => GetJournal(groupId(), journalId),
      updateJournal$: (journalId, newData) => UpdateJournal(groupId(), journalId, newData),
      history$: createHistoryManager(wrappedLocalStorage)
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useJournalContext() {
  return useContext(Context)!
}