import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
// ...
import __style from "./[groupId].module.css"
// ...
import { createStorage, type IStorage } from "~/utils"
import { CreateJournal, GetJournal, UpdateJournal } from "~/wailsjs/go/journal/Exports"
import type { notes } from "~/wailsjs/go/models"
import { useToggle } from "~/hooks"
// ...
import { createFileExplorerContext, createFileNode, createFolderNode, type IFileExplorerContext, type IFileExplorerProviderOptions, ROOT_FOLDER } from "./explorer"
import { createHistoryManager, type IHistoryManager } from "./history"

export type JournalSessionStorage = IStorage<{
  journal_data$: {
    groupId$: string
  }
  sidebar_hidden$: boolean
  [key: `explorer.${number}`]: boolean
}>

export type JournalLocalStorage = IStorage<{
  last_opened$: notes.NoteData | null
}>

export interface IJournalContext {
  createJournal$(type: number, data: notes.CreateNoteOptions): Promise<notes.NoteData>
  getJournal$(journalId: string): Promise<notes.NoteData>
  updateJournal$(journalId: string, newData: notes.UpdateNoteOptions): Promise<void>
  // ...
  sessionStorage$: JournalSessionStorage
  explorerTree$: IFileExplorerContext
  history$: IHistoryManager
  sidebar$: {
    toggle$: () => boolean
    isHidden$: Accessor<boolean>
  }
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

  const createJournal: IJournalContext["createJournal$"] = async (type, data) => {
    const newData = await CreateJournal(groupId(), type, data)
    const explorerNode = (type == 1 ? createFolderNode : createFileNode)(newData.id)
    // @ts-ignore
    explorerTree.tree$.create$(explorerNode, ROOT_FOLDER, newData)
    return newData
  }

  const [isSidebarHidden, toggleHideSidebar] = useToggle()

  return (
    <Context.Provider value={{
      sidebar$: {
        isHidden$: isSidebarHidden,
        toggle$: toggleHideSidebar
      },
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