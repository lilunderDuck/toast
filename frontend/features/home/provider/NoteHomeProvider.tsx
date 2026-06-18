import { type Accessor, createContext, createResource, createSignal, type ParentProps, type Resource, useContext } from "solid-js"
// ...
import type { ToastOptions } from "~/components/ui/toasts/util"

interface INoteHomeContext {
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
  resource$: Resource<never[]>
}

const Context = createContext<INoteHomeContext>()

interface INoteHomeProviderProps {
}

export function NoteHomeProvider(props: ParentProps<INoteHomeProviderProps>) {
  const [groups, setGroups] = createSignal([])

  const [resource] = createResource(async () => {
    return []
  })

  const toastOptions: ToastOptions = {
    duration: 5_000,
    position: ToastPosition.TOP_RIGHT
  }

  return (
    <Context.Provider value={{
      groups$: groups,
      resource$: resource,
      async addGroup$(data) {
      },
      async editGroup$(targetGroupId, options) {
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useNoteHomeContext() {
  return useContext(Context)!
}