import { createContext, createEffect, createSignal, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
// ...
import { useTreeViewContext } from "~/features/tree-view"
// ...
import { DEFAULT_TASK_DATA, type AnyTaskData, type ITaskDataMapping } from "./data"

interface ITaskDataContext {
  /**Creates a new task or section. 
   * @param type The type of task/node to create
   * @param parentNodeId The ID of the parent node. If creating a section, 
   * this should pass in `undefined` or `TREE_VIEW_ROOT_NODE_ID`.
   * @param options The initial data for the new task/section.
  */
  create$<T extends TaskType>(
    type: T, 
    parentNodeId: number | undefined, 
    options: ITaskDataMapping[T]["schema"]
  ): void
  /**Mark any task as completed or not. 
   * @param taskId the target task id.
   * @param state 
   */
  setIsCompleted$(taskId: number, state: boolean): void
  /**Updates the data for a specific task or section. 
   * @param nodeId The ID of the task or section to update.
   * @param data The partial data object containing the fields to update.
   */
  update$<T extends TaskType>(
    nodeId: number, 
    data: Partial<ITaskDataMapping[T]["data"]>
  ): void
  /**Gets the id of the task currently open for editing. */
  currentEditedTask$: Accessor<number | undefined>
  /**Sets the id of the task currently open for editing. */
  setCurrentEditedTask$: Setter<number | undefined>
  deleteSection$(sectionId: number): void
  deleteTask$(sectionId: number, taskId: number): void
}

const Context = createContext<ITaskDataContext>()

/**This provider manages state and data for all of the tasks */
export function TaskDataProvider(props: ParentProps) {
  const { addNode$, editNodeData$, data$, deleteNode$ } = useTreeViewContext<AnyTaskData>()

  const [currentEditedTask, setCurrentEditedTask] = createSignal<number>()

  const create = <T extends TaskType>( // <- ITaskDataContext["create$"]
    type: T, 
    parentNodeId: number | undefined, 
    options: ITaskDataMapping[T]["schema"]
  ) => {
    if (!parentNodeId) {
      parentNodeId = TREE_VIEW_ROOT_NODE_ID
    }

    // Asserting just to make sure no weird shit will happen
    console.assert(DEFAULT_TASK_DATA[type], "Missing default data for task type: %d", type)
    isDevMode && (() => {
      if (type === TaskType.SECTION) {
        console.assert(
          parentNodeId === TREE_VIEW_ROOT_NODE_ID,
          "Task section can only be created in the top root node."
        )
      }
    })()

    const taskData = { 
      ...DEFAULT_TASK_DATA[type]() as ITaskDataMapping[T]["data"], 
      ...options,
      parentId: parentNodeId
    }

    addNode$(
      // TODO: maybe we will have sub-task in the future as well.
      TreeViewNodeType.PARENT, 
      parentNodeId, 
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

  const deleteSection = (sectionId: number) => {
    // Make sure you don't delete everything and leave it empty
    if (data$().tree.length === 1) {
      return // don't delete the last one
    }

    deleteNode$(sectionId, TREE_VIEW_ROOT_NODE_ID)
  }
  
  const deleteTask = (sectionId: number, taskId: number) => {
    deleteNode$(taskId, sectionId)
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
      setCurrentEditedTask$: setCurrentEditedTask,
      deleteSection$: deleteSection,
      deleteTask$: deleteTask
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTaskDataContext() {
  return useContext(Context)!
}