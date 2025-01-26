import { createContext, createSignal, type ParentProps, Signal, useContext } from "solid-js"
// ...
import { AnyTodoSection } from "~/features/editor/types"

interface ITodoSectionProviderProps {
  id: AnyTodoSection["id"]
}

interface ITodoSectionContext extends ITodoSectionProviderProps {
  isShowingTodoInput$: Signal<boolean>
  isShowingSectionInput$: Signal<boolean>
}

const Context = createContext<ITodoSectionContext>()

export function TodoSectionProvider(props: ParentProps<ITodoSectionProviderProps>) {
  const isShowingTodoInput = createSignal(false)
  const isShowingSectionInput = createSignal(false)

  return (
    <Context.Provider value={{
      id: props.id,
      isShowingTodoInput$: isShowingTodoInput,
      isShowingSectionInput$: isShowingSectionInput,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTodoSectionContext() {
  return useContext(Context)!
} 