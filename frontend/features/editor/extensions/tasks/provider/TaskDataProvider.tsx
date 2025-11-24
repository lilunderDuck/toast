import { createContext, ParentProps, useContext } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { arrayObjects, makeId } from "~/utils"
// ...
import type { TaskData, TasksAttribute } from "./data"

interface ITaskDataContext {
  readonly data$: TasksAttribute
}

const Context = createContext<ITaskDataContext>()

interface ITaskDataProviderProps {
  attrs$: TasksAttribute
}

export function TaskDataProvider(props: ParentProps<ITaskDataProviderProps>) {
  const [store, setStore] = createStore(props.attrs$)

  const create = (parentId?: string) => {
    const newData: TaskData = {
      name: "",
      completed: false,
      id: makeId(5)
    }

    if (parentId) {
      const [, index] = arrayObjects(store.tasks).find$(it => it.id === parentId)
      console.assert(index !== -1, "Cannot find task parent id: %s", parentId)
      setStore("tasks", 0, "subTask", index, newData)
    } else {
      setStore("tasks", store.tasks.length, newData)
    }

    console.log(store.tasks)
  }

  return (
    <Context.Provider value={{
      data$: store
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTaskDataContext() {
  return useContext(Context)!
}