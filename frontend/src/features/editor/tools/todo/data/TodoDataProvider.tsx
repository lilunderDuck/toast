import { createContext, type ParentProps, useContext } from "solid-js"
import type { ITodoBlockData } from "./this"
import { createTodo, type ITodoUtils } from "./todo"

export interface ITodoDataProviderProps {
  dataIn$: ITodoBlockData
  onChange$(data: ITodoBlockData): void
}

interface ITodoDataContext extends ITodoUtils {
  // ...
}

const Context = createContext<ITodoDataContext>()

export function TodoDataProvider(props: ParentProps<ITodoDataProviderProps>) {
  return (
    <Context.Provider value={createTodo(props.dataIn$, props.onChange$)}>
      {props.children}
    </Context.Provider>
  )
}

export function useTodoDataContext() {
  return useContext(Context)!
}