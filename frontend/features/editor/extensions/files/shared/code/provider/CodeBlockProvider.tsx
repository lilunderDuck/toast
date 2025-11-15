import { createContext, createSignal, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
import type { CodeBlockData } from "./types"

interface ICodeBlockContext {
  data$: Accessor<CodeBlockData>
  isShowingInput$: Accessor<boolean>
  setIsShowingInput$: Setter<boolean>
  updateData$: (data: Partial<CodeBlockData>) => any
}

const Context = createContext<ICodeBlockContext>()

interface ICodeBlockProviderProps {
  data$: CodeBlockData
  onChange$: (data: Partial<CodeBlockData>) => any
}

export function CodeBlockProvider(props: ParentProps<ICodeBlockProviderProps>) {
  const [codeData, setCodeData] = createSignal(props.data$)
  const [isShowingInput, setIsShowingInput] = createSignal(false)

  const updateData: ICodeBlockProviderProps["onChange$"] = (data) => {
    props.onChange$(data)
    setCodeData(prev => ({ ...prev, ...data }))
  }

  return (
    <Context.Provider value={{
      data$: codeData,
      isShowingInput$: isShowingInput, 
      setIsShowingInput$: setIsShowingInput,
      updateData$: updateData
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useCodeBlockContext() {
  return useContext(Context)!
}