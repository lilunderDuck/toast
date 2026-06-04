import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
// ...
import type { ToastOptions } from "~/components/util"

interface IJournalHomeContext {
  /**Reactive array of all journal groups. */
  groups$: Accessor<[]>
  /**Asynchronously creates a new journal group and updates the UI.
   * @param data Options for the new journal group.
   */
  addGroup$(data: null): Promise<void>
  /**Asynchronously edits an existing journal group and updates the UI.
   * @param targetGroupId The group id to edit.
   * @param options The new options for the journal group.
   */
  editGroup$(targetGroupId: string, options: null): Promise<void>
}

const Context = createContext<IJournalHomeContext>()

interface IJournalHomeProviderProps {
  groups$: []
}

export function JournalHomeProvider(props: ParentProps<IJournalHomeProviderProps>) {
  const [groups, setGroups] = createSignal(props.groups$)

  const toastOptions: ToastOptions = {
    duration: 5_000,
    position: ToastPosition.TOP_RIGHT
  }

  return (
    <Context.Provider value={{
      groups$: groups,
      async addGroup$(data) {
      },
      async editGroup$(targetGroupId, options) {
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useJournalHomeContext() {
  return useContext(Context)!
}