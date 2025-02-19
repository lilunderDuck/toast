import { Accessor, createContext, createSignal, ParentProps, useContext } from "solid-js"
import { editor_logWithLabel } from "~/features/editor/utils"

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
    //debug-start
    editor_logWithLabel("todo", "Showing todo input...")
    //debug-end
    setIsShowingTodoInput(true)
    setIsShowingSectionInput(false)
  }
  
  const showSectionInput = () => {
    //debug-start
    editor_logWithLabel("todo", "Showing todo section input...")
    //debug-end
    setIsShowingSectionInput(true)
    setIsShowingTodoInput(false)
  }
  
  //debug-start
  editor_logWithLabel("todo", "TodoSectionProvider created with section id:", props.sectionId$)
  //debug-end

  return (
    <Context.Provider value={{
      sectionId$: props.sectionId$,
      isShowingSectionInput$: isShowingSectionInput,
      isShowingTodoInput$: isShowingTodoInput,
      showTodoInput$: showTodoInput,
      showSectionInput$: showSectionInput,
      closeTodoInput$: () => {
        setIsShowingTodoInput(false)
        //debug-start
        editor_logWithLabel("todo", "todo input closed")
        //debug-end
      },
      closeSectionInput$: () => {
        setIsShowingSectionInput(false)
        //debug-start
        editor_logWithLabel("todo", "todo section input closed")
        //debug-end
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTodoSectionContext() {
  return useContext(Context)!
}