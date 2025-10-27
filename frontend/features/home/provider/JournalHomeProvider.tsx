import { type Accessor, createContext, createSignal, type ParentProps, type Signal, useContext } from "solid-js"
// ...
import { toast } from "~/libs/solid-toast"
import { arrayObjects } from "~/utils"
import type { ToastOptions } from "~/libs/solid-toast/util"
import type { group } from "~/wailsjs/go/models"
// ...
import { GroupAddedToast, GroupEditedToast } from "../components"
import { CreateGroup, UpdateGroup } from "~/wailsjs/go/group/Exports"

interface IJournalHomeContext {
  /**Reactive array of all journal groups. */
  groups$: Accessor<group.JournalGroupData[]>
  /**Asynchronously creates a new journal group and updates the UI.
   * @param data Options for the new journal group.
   */
  addGroup$(data: group.JournalGroupOptions): Promise<void>
  /**Asynchronously edits an existing journal group and updates the UI.
   * @param targetGroupId The group id to edit.
   * @param options The new options for the journal group.
   */
  editGroup$(targetGroupId: number, options: group.JournalGroupOptions): Promise<void>
}

const Context = createContext<IJournalHomeContext>()

interface IJournalHomeProviderProps {
  groups$: group.JournalGroupData[]
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
        const newGroup = await CreateGroup(data)
        setGroups(prev => [newGroup, ...prev])
        toast.custom((toast) => <GroupAddedToast {...toast} name$={newGroup.name} />, toastOptions)
        console.log("added group:", data)
      },
      async editGroup$(targetGroupId, options) {
        const newData = await UpdateGroup(targetGroupId, options)
        setGroups(prev => [...arrayObjects(prev).replace$(it => it.id === targetGroupId, newData)])
        toast.custom((toast) => <GroupEditedToast {...toast} name$={newData.name} />, toastOptions)
        console.log("edited group:", targetGroupId, options)
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useJournalHomeContext() {
  return useContext(Context)!
}