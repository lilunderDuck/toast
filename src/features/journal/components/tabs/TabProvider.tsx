import { createContext, ParentProps } from "solid-js"

const Context = createContext()

export function TabProvider(props: ParentProps) {
  return (
    <Context.Provider value={{
      
    }}>
      {props.children}
    </Context.Provider>
  )
}