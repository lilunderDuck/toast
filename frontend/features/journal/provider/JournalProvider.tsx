import { createContext, type ParentProps, useContext } from "solid-js"
// ...
import { createStorage, type IStorage } from "~/utils"
import { CreateJournal, GetJournal, UpdateJournal } from "~/wailsjs/go/journal/GroupExport"
import type { journal } from "~/wailsjs/go/models"
// ...
import { createFileExplorerContext, FILE_NODE, FOLDER_NODE, type IFileExplorerContext, type IFileExplorerProviderOptions, ROOT_FOLDER } from "./explorer"

export interface IJournalContext {
  sessionStorage$: IStorage<{
    journal_data$: {
      groupId$: number
    }
    [key: `explorer.${number}`]: boolean
  }>
  createJournal$(type: number, data: journal.JournalOptions): Promise<journal.JournalData>
  getJournal$(journalId: number): Promise<journal.JournalData>
  updateJournal$(journalId: number, newData: journal.JournalOptions): Promise<journal.JournalData>
  explorerTree$: IFileExplorerContext
}

export interface IJournalProviderProps {
  explorerOptions$: IFileExplorerProviderOptions
}

const Context = createContext<IJournalContext>()

export function JournalProvider(props: ParentProps<IJournalProviderProps>) {
  const wrappedSessionStorage: IJournalContext["sessionStorage$"] = createStorage(sessionStorage)
  const groupId = () => wrappedSessionStorage.get$('journal_data$').groupId$
  const explorerTree = createFileExplorerContext(props.explorerOptions$)

  return (
    <Context.Provider value={{
      explorerTree$: explorerTree,
      sessionStorage$: wrappedSessionStorage,
      async createJournal$(type, data) {
        const newData = await CreateJournal(groupId(), type, data)
        const explorerNode = type == 1 ? FOLDER_NODE : FILE_NODE
        explorerNode.id = newData.id
        // @ts-ignore
        explorerTree.tree$.create$(explorerNode, ROOT_FOLDER, newData)
        return newData
      },
      getJournal$: (journalId) => GetJournal(groupId(), journalId),
      updateJournal$: (journalId, newData) => UpdateJournal(groupId(), journalId, newData)
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useJournalContext() {
  return useContext(Context)!
}