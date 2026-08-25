import { type Accessor, createContext, createResource, createSignal, type ParentProps, type Resource, useContext } from "solid-js"
import type { note } from "~/wailsjs/go/models"

interface INotePageContext {
  /**Reactive array of all journal groups. */
  groups$: Accessor<note.NoteGroup[]>
  /**Asynchronously creates a new journal group and updates the UI.
   * @param data Options for the new journal group.
   */
  addGroup$(data: null): Promise<void>
  /**Asynchronously edits an existing journal group and updates the UI.
   * @param targetGroupId The group id to edit.
   * @param options The new options for the journal group.
   */
  editGroup$(targetGroupId: string, options: null): Promise<void>
  resource$: Resource<note.NoteGroup[]>
}

const Context = createContext<INotePageContext>()

interface INotePageProviderProps {
}

export function NotePageProvider(props: ParentProps<INotePageProviderProps>) {
  const [groups, setGroups] = createSignal([
    {
      name: "test",
      id: "test_id",
      description: "some description"
    }
  ] as note.NoteGroup[])

  return (
    <Context.Provider value={{
      groups$: groups,
      resource$: createResource(async() => groups())[0],
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