import { createContext, ParentProps, useContext } from "solid-js"
// ...
import { makeId } from "~/utils"
import { useTreeViewContext } from "~/features/tree-view"
// ...
import type { TaskData } from "./data"

interface ITaskDataContext {
  create$(parentNodeId?: number): void
  setIsCompleted$(taskId: number, state: boolean): void
}

const Context = createContext<ITaskDataContext>()

export function TaskDataProvider(props: ParentProps) {
  const { add$, editNodeData$ } = useTreeViewContext<TaskData>()

  const create: ITaskDataContext["create$"] = (parentNodeId) => {
    add$(TreeViewNodeType.PARENT, parentNodeId ?? TREE_VIEW_ROOT_NODE_ID, {
      name: "",
      completed: false,
      id: makeId(5)
    })
  }

  const setIsCompleted = (taskId: number, state: boolean) => {
    editNodeData$(taskId, (prev) => ({ ...prev, completed: state }))
  }

  return (
    <Context.Provider value={{
      create$: create,
      setIsCompleted$: setIsCompleted,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTaskDataContext() {
  return useContext(Context)!
}