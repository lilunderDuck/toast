import { type Accessor, createContext, createResource, createSignal, type ParentProps, useContext } from "solid-js"
import { toast } from "~/libs/solid-toast"
import { arrayObjects } from "~/utils"
// ...
import { CreateGroup, GetAllGroups, UpdateGroup } from "~/wailsjs/go/journal/GroupExport"
import type { journal } from "~/wailsjs/go/models"
import { GroupAddedToast, GroupEditedToast } from "../components"
import type { ToastOptions } from "~/libs/solid-toast/util"

interface IJournalHomeContext {
  /**Reactive array of all journal groups. */
  groups$: Accessor<journal.JournalGroupData[]>
  /**Whether the group data is currently being loaded or not. */
  isLoading$: () => boolean
  /**Asynchronously creates a new journal group and updates the UI.
   * @param data Options for the new journal group.
   */
  addGroup$(data: journal.JournalGroupOptions): Promise<void>
  /**Asynchronously edits an existing journal group and updates the UI.
   * @param targetGroupId The group id to edit.
   * @param options The new options for the journal group.
   */
  editGroup$(targetGroupId: number, options: journal.JournalGroupOptions): Promise<void>
}

const Context = createContext<IJournalHomeContext>()

export function JournalHomeProvider(props: ParentProps) {
  const [resource] = createResource(GetAllGroups)
  const [groups, setGroups] = createSignal<journal.JournalGroupData[]>([])

  const toastOptions: ToastOptions = {
    duration: 5_000,
    position: ToastPosition.TOP_RIGHT
  }

  return (
    <Context.Provider value={{
      groups$: groups,
      isLoading$: () => resource.loading,
      async addGroup$(data) {
        const newGroup = await CreateGroup(data)
        setGroups(prev => [newGroup, ...prev])
        toast.custom((toast) => <GroupAddedToast {...toast} name$={newGroup.name} />, toastOptions)
      },
      async editGroup$(targetGroupId, options) {
        const newData = await UpdateGroup(targetGroupId, options)
        setGroups(prev => [...arrayObjects(prev).replace$(it => it.id === targetGroupId, newData)])
        toast.custom((toast) => <GroupEditedToast {...toast} name$={newData.name} />, toastOptions)
      }
    }}>
      {void setGroups(resource() ?? [])}
      {props.children}
    </Context.Provider>
  )
}

export function useJournalHomeContext() {
  return useContext(Context)!
}