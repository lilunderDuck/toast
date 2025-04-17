import { Accessor, createContext, createSignal, ParentProps, useContext } from "solid-js"
// ...
import { editorLog } from "~/features/debug"

interface ITodoSectionProviderProps {
  sectionId$: number
}

interface ITodoSectionContext {
  sectionId$: number
  isShowingSectionInput$: Accessor<boolean>
  isShowingTodoInput$: Accessor<boolean>
  showSectionInput$(): void
  showTodoInput$(): void
  closeTodoInput$(): void
  closeSectionInput$(): void
}

const Context = createContext<ITodoSectionContext>()

export function TodoSectionProvider(props: ParentProps<ITodoSectionProviderProps>) {
  const [isShowingSectionInput, setIsShowingSectionInput] = createSignal(false)
  const [isShowingTodoInput, setIsShowingTodoInput] = createSignal(false)

  const showTodoInput = () => {
    isDevMode && editorLog.logLabel("todo", "Showing todo input...")
    
    setIsShowingTodoInput(true)
    setIsShowingSectionInput(false)
  }
  
  const showSectionInput = () => {
    isDevMode && editorLog.logLabel("todo", "Showing todo section input...")
    
    setIsShowingSectionInput(true)
    setIsShowingTodoInput(false)
  }
  
  isDevMode && editorLog.logLabel("todo", "TodoSectionProvider created with section id:", props.sectionId$)
  
  return (
    <Context.Provider value={{
      sectionId$: props.sectionId$,
      isShowingSectionInput$: isShowingSectionInput,
      isShowingTodoInput$: isShowingTodoInput,
      showTodoInput$: showTodoInput,
      showSectionInput$: showSectionInput,
      closeTodoInput$: () => {
        setIsShowingTodoInput(false)
        isDevMode && editorLog.logLabel("todo", "todo input closed")
      },
      closeSectionInput$: () => {
        setIsShowingSectionInput(false)
        isDevMode && editorLog.logLabel("todo", "todo section input closed")
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTodoSectionContext() {
  return useContext(Context)!
}