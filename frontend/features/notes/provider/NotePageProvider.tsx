import { type Accessor, createContext, createResource, createSignal, type ParentProps, type Resource, type Setter, useContext } from "solid-js"

interface INotePageContext {
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

  view$: Accessor<NotePageViewType>
  setView$: Setter<NotePageViewType>
}

const Context = createContext<INotePageContext>()

interface INotePageProviderProps {
}

export function NotePageProvider(props: ParentProps<INotePageProviderProps>) {
  const [groups, setGroups] = createSignal([] as [])
  const [view, setView] = createSignal<NotePageViewType>(NotePageViewType.NOTE)

  return (
    <Context.Provider value={{
      groups$: groups,
      view$: view,
      setView$: setView,
      resource$: createResource(() => true)[0],
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