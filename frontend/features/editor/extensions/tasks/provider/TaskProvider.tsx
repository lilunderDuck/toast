import { createContext, type ParentProps, useContext } from "solid-js"
// ...
import { useTreeViewContext, type TreeViewComponentProps } from "~/features/tree-view"
// ...
import type { TaskData } from "./data"
import { useTaskDataContext } from "./TaskDataProvider"

interface ITaskContext {
  isShowingInput$: () => boolean
  setIsShowingInput$: (state: boolean) => void
  /**Returns the current task data */
  data$: () => TreeViewComponentProps<TaskData>
  delete$: () => void
}

const Context = createContext<ITaskContext>()

interface ITaskProviderProps {
  data$: ReturnType<ITaskContext["data$"]>
}

/**This provider manages state to a single task */
export function TaskProvider(props: ParentProps<ITaskProviderProps>) {
  const { currentEditedTask$, setCurrentEditedTask$ } = useTaskDataContext()
  const { deleteNode$, data$ } = useTreeViewContext()

  const TASK_NODE_ID = props.data$.nodeId$

  return (
    <Context.Provider value={{
      data$: () => props.data$,
      delete$() {
        const sectionId = data$().storage[TASK_NODE_ID].parentId
        deleteNode$(TASK_NODE_ID, sectionId)
      },
      isShowingInput$: () => currentEditedTask$() === TASK_NODE_ID,
      setIsShowingInput$: (state) => {
        setCurrentEditedTask$(state ? TASK_NODE_ID : undefined)
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTaskContext() {
  return useContext(Context)!
}