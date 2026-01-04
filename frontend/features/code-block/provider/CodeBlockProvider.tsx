import { createContext, createSignal, ParentProps, useContext, type Accessor } from "solid-js"
import type { CodeBlockData } from "./types"

interface ICodeBlockContext {
  data$: Accessor<CodeBlockData>
  updateData$: (data: Partial<CodeBlockData>) => any
}

const Context = createContext<ICodeBlockContext>()

interface ICodeBlockProviderProps {
  data$: CodeBlockData
  onChange$: (data: Partial<CodeBlockData>) => any
}

export function CodeBlockProvider(props: ParentProps<ICodeBlockProviderProps>) {
  const [codeData, setCodeData] = createSignal(props.data$)

  const updateData: ICodeBlockProviderProps["onChange$"] = (data) => {
    props.onChange$(data)
    setCodeData(prev => ({ ...prev, ...data }))
  }

  return (
    <Context.Provider value={{
      data$: codeData,
      updateData$: updateData
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useCodeBlockContext() {
  return useContext(Context)!
}