import { createContext, type ParentProps, useContext, type Accessor } from "solid-js"
// ...
import type { TreeViewComponentProps } from "~/features/tree-view"
// ...
import type { TaskData } from "./data"
import { useTaskDataContext } from "./TaskDataProvider"

interface ITaskContext {
  isShowingInput$: Accessor<boolean>
  setIsShowingInput$: (state: boolean) => void
  data$: () => TreeViewComponentProps<TaskData>
}

const Context = createContext<ITaskContext>()

interface ITaskProviderProps {
  data$: ReturnType<ITaskContext["data$"]>
}

/**This provider manages state to a single task */
export function TaskProvider(props: ParentProps<ITaskProviderProps>) {
  const { currentEditedTask$, setCurrentEditedTask$ } = useTaskDataContext()

  return (
    <Context.Provider value={{
      data$: () => props.data$,
      isShowingInput$: () => currentEditedTask$() === props.data$.nodeId$,
      setIsShowingInput$: (state) => {
        setCurrentEditedTask$(state ? props.data$.nodeId$ : undefined)
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTaskContext() {
  return useContext(Context)!
}