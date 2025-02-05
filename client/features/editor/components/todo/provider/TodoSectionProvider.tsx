import { createContext, createSignal, type ParentProps, Signal, useContext } from "solid-js"
// ...
import type { 
  AnyTodoSection, 
} from "client/features/editor/types"

export type TodoInputOptions<T> = Partial<T> & {
  onClose$(): void
  onSubmit$(data: T): void
  isEditMode$?: boolean
}

interface ITodoSectionProviderProps {
  id: AnyTodoSection["id"]
}

interface ITodoSectionContext extends ITodoSectionProviderProps {
  isShowingTodoInput$: Signal<boolean>
  isShowingSectionInput$: Signal<boolean>
}

const Context = createContext<ITodoSectionContext>()

export function TodoSectionProvider(props: ParentProps<ITodoSectionProviderProps>) {
  const [isShowingTodoInput, setIsShowingTodoInput] = createSignal(false)
  const [isShowingSectionInput, setIsShowingSectionInput] = createSignal(false)

  return (
    <Context.Provider value={{
      id: props.id,
      isShowingTodoInput$: [isShowingTodoInput, setIsShowingTodoInput],
      isShowingSectionInput$: [isShowingSectionInput, setIsShowingSectionInput],
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTodoSectionContext() {
  return useContext(Context)!
} 