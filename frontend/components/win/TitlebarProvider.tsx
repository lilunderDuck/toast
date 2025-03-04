import { createContext, type ParentProps, useContext } from "solid-js"

const Context = createContext()

export function TitlebarProvider(props: ParentProps) {
  return (
    <Context.Provider value={{}}>
      {props.children}
    </Context.Provider>
  )
}

export function useTitlebarContext() {
  return useContext(Context)
}