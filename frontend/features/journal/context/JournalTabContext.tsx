import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
// ...
import { createEvent, type IEvent } from "~/utils"

export type JournalTabEventMap = {
  tabs__spawned(tabId: number): any
}

export type TabData = {
  name$: string
}

export interface IJournalTabProviderProps {
  getDisplayName$(tabId: number): Promise<string>
}

export interface IJournalTabContext {
  tabs$: Accessor<TabData[]>
  spawn$(tabId: number): void
  update$(newCurrentTabName: string): void
  event$: IEvent<JournalTabEventMap>
}

const Context = createContext<IJournalTabContext>()

export function JournalTabProvider(props: ParentProps<IJournalTabProviderProps>) {
  const [tabs, setTabs] = createSignal<TabData[]>([
    { name$: "New tab" }
  ])

  let currentActiveTabIndex = 0
  const tabEvent = createEvent<JournalTabEventMap>()

  const spawnTab: IJournalTabContext["spawn$"] = async(newCurrentTabName) => {
    setTabs(prev => [...prev, {
      name$: newCurrentTabName,
    }])
  }

  const updateTab: IJournalTabContext["update$"] = async(newCurrentTabName) => {
    setTabs(prev => {
      prev[currentActiveTabIndex] = {
        name$: newCurrentTabName
      }

      return [...prev]
    })
  }

  return (
    <Context.Provider value={{
      tabs$: tabs,
      spawn$: spawnTab,
      update$: updateTab,
      event$: tabEvent,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useJournalTabContext() {
  return useContext(Context)!
}