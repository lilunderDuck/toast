import { Accessor, createContext, createSignal, ParentProps, useContext } from "solid-js"
import { editorLog } from "~/features/editor/utils"

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
    editorLog.logLabel("todo", "Showing todo input...")
    //debug-end
    setIsShowingTodoInput(true)
    setIsShowingSectionInput(false)
  }
  
  const showSectionInput = () => {
    //debug-start
    editorLog.logLabel("todo", "Showing todo section input...")
    //debug-end
    setIsShowingSectionInput(true)
    setIsShowingTodoInput(false)
  }
  
  //debug-start
  editorLog.logLabel("todo", "TodoSectionProvider created with section id:", props.sectionId$)
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
        editorLog.logLabel("todo", "todo input closed")
        //debug-end
      },
      closeSectionInput$: () => {
        setIsShowingSectionInput(false)
        //debug-start
        editorLog.logLabel("todo", "todo section input closed")
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