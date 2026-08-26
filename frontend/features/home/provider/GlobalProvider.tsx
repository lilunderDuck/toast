import { useLocation } from "@solidjs/router"
import { DEBUG_INFO_LABEL } from "macro-def"
import { createContext, createEffect, ParentProps, useContext } from "solid-js"
// ...
import { createHistory, type HistoryHandler } from "../utils"

interface IGlobalContext {
  history$: HistoryHandler
}

const Context = createContext<IGlobalContext>()

interface IGlobalProviderProps {
}

export function GlobalProvider(props: ParentProps<IGlobalProviderProps>) {
  const location = useLocation()
  const history = createHistory()

  if (TOAST_DEBUG) {
    createEffect(() => {
      DEBUG_INFO_LABEL("global/route", "transition to", location.pathname)
      history.add$(location.pathname)
    })
  }

  return (
    <Context.Provider value={{
      history$: history
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGlobalContext() {
  return useContext(Context)!
}