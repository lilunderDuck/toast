import { createContext, type ParentProps, useContext } from "solid-js"
// ...
import { createEvent, type IEvent } from "~/utils"
// ...
import { createInfoSidebar, type IInfoSidebarUtils } from "./infoSIdebar"
import { createJournalGrid, type IJournalGridUtils } from "./grid"

export type JournalHomeEvent = {
  home__infoSidebarClose(): void
}

interface IJournalHomeContext {
  infoSidebar$: IInfoSidebarUtils
  grid$: IJournalGridUtils
  // ...
  event$: IEvent<JournalHomeEvent>
}

const Context = createContext<IJournalHomeContext>()

export function JournalHomeProvider(props: ParentProps) {
  const event = createEvent<JournalHomeEvent>()

  const infoSidebar = createInfoSidebar(event)
  const grid = createJournalGrid()

  return (
    <Context.Provider value={{
      event$: event,
      infoSidebar$: infoSidebar,
      grid$: grid
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useJournalHomeContext = () => useContext(Context)!