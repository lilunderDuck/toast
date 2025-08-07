import { Accessor, createContext, createResource, createSignal, ParentProps, useContext } from "solid-js"
// ...
import { GetAllGroups } from "~/wailsjs/go/journal/GroupExport"
import { journal } from "~/wailsjs/go/models"

interface IJournalHomeContext {
  groups$: Accessor<journal.JournalGroupData[]>
  isLoading$: () => boolean
  addGroup$(data: journal.JournalGroupData): void
}

const Context = createContext<IJournalHomeContext>()

export function JournalHomeProvider(props: ParentProps) {
  const [resource] = createResource(GetAllGroups)
  const [groups, setGroups] = createSignal([])

  return (
    <Context.Provider value={{
      groups$: groups,
      isLoading$: () => resource.loading,
      addGroup$(data) {
        setGroups(prev => [data, ...prev])
      }
    }}>
      {void setGroups(resource())}
      {props.children}
    </Context.Provider>
  )
}

export function useJournalHomeContext() {
  return useContext(Context)!
}