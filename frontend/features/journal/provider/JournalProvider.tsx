import { createContext, ParentProps, useContext } from "solid-js"
import { DONT_RENDER, ROOT_FOLDER, useFileExplorerContext } from "~/features/explorer"
import { createStorage, IStorage } from "~/utils"
import { CreateJournal, GetJournal, UpdateJournal } from "~/wailsjs/go/journal/GroupExport"
import type { journal } from "~/wailsjs/go/models"

export interface IJournalContext {
  sessionStorage$: IStorage<{
    journal_data$: {
      groupId$: number
    }
  }>
  createJournal$(type: number, data: journal.JournalOptions): Promise<journal.JournalData>
  getJournal$(journalId: number): Promise<journal.JournalData>
  updateJournal$(journalId: number, newData: journal.JournalOptions): Promise<journal.JournalData>
}

const Context = createContext<IJournalContext>()

export function JournalProvider(props: ParentProps) {
  const { tree$ } = useFileExplorerContext()
  const wrappedSessionStorage: IJournalContext["sessionStorage$"] = createStorage(sessionStorage)
  const groupId = () => wrappedSessionStorage.get$('journal_data$').groupId$

  return (
    <Context.Provider value={{
      sessionStorage$: wrappedSessionStorage,
      async createJournal$(type, data) {
        const newData = await CreateJournal(groupId(), type, data)
        const explorerNode = { id: newData.id }
        if (type == 1) {
          explorerNode['child'] = [{ id: DONT_RENDER }]
        }

        tree$.create$(explorerNode, ROOT_FOLDER, newData)
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