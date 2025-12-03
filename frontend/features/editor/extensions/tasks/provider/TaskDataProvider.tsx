import { createContext, createEffect, createSignal, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
// ...
import { useTreeViewContext } from "~/features/tree-view"
// ...
import { DEFAULT_TASK_DATA, type AnyTaskData, type ITaskDataMapping } from "./data"

interface ITaskDataContext {
  create$<T extends TaskType>(
    type: T, 
    parentNodeId: number | undefined, 
    options: ITaskDataMapping[T]["schema"]
  ): void
  setIsCompleted$(taskId: number, state: boolean): void
  update$<T extends TaskType>(
    nodeId: number, 
    data: Partial<ITaskDataMapping[T]["data"]>
  ): void
  // delete$(nodeId: number): void
  currentEditedTask$: Accessor<number | undefined>
  setCurrentEditedTask$: Setter<number | undefined>
}

const Context = createContext<ITaskDataContext>()

/**This provider manages state and data for all of the tasks */
export function TaskDataProvider(props: ParentProps) {
  const { add$, editNodeData$ } = useTreeViewContext<AnyTaskData>()

  const [currentEditedTask, setCurrentEditedTask] = createSignal<number>()

  // ITaskDataContext["create$"]
  const create = <T extends TaskType>(
    type: T, 
    parentNodeId: number | undefined, 
    options: ITaskDataMapping[T]["schema"]
  ) => {
    console.assert(DEFAULT_TASK_DATA[type], "Missing default data for task type: %d", type)
    isDevMode && (() => {
      if (type === TaskType.SECTION) {
        console.assert(
          !parentNodeId || parentNodeId === TREE_VIEW_ROOT_NODE_ID,
          "Task section can only be created in the top root node."
        )
      }
    })()

    const taskData = { 
      ...DEFAULT_TASK_DATA[type]() as ITaskDataMapping[T]["data"], 
      ...options 
    }

    add$(
      TreeViewNodeType.PARENT, 
      parentNodeId ?? TREE_VIEW_ROOT_NODE_ID, 
      taskData
    )
    console.log("[task] created task", taskData, "at", parentNodeId)
  }

  const editTask: ITaskDataContext["update$"] = (nodeId, data) => {
    editNodeData$(nodeId, (prev) => ({ ...prev, ...data }))
    console.log("[task] edited task", nodeId, "with", data)
  }

  const setIsCompleted = (taskId: number, state: boolean) => {
    editNodeData$(taskId, (prev) => ({ ...prev, completed: state }))
    console.log("[task] marked task", taskId, "completion as", state)
  }

  isDevMode && (
    createEffect(() => {
      console.log("[task] current edited task is:", currentEditedTask())
    })
  )

  return (
    <Context.Provider value={{
      create$: create,
      update$: editTask,
      setIsCompleted$: setIsCompleted,
      currentEditedTask$: currentEditedTask,
      setCurrentEditedTask$: setCurrentEditedTask
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTaskDataContext() {
  return useContext(Context)!
}