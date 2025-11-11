import { createContext, createSignal, type ParentProps, useContext } from "solid-js"
// ...
import { createTabs, type StateSlice, type TabsHandler } from "~/hooks"
import { createEvent, type IEvent } from "~/utils"
// ...
import type { TableAttribute, TableGridData, TableTabData } from "./data"
import { useNodeState } from "~/features/editor/utils"

type TableDataEventMap = IEvent<{
  [TableDataEvent.UPDATE]: (tableTabId: string, data: TableGridData) => any
}>

interface ITablesDataContext {
  event$: TableDataEventMap
  title$: StateSlice<string>
  tabs$: TabsHandler<TableTabData>
}

const Context = createContext<ITablesDataContext>()

interface ITablesDataProviderProps {
  // ...
}

export function TablesDataProvider(props: ParentProps<ITablesDataProviderProps>) {
  const { data$, updateAttribute$ } = useNodeState<TableAttribute>()

  const tabs = createTabs<TableTabData>(data$().tabs)
  const [title, setTitle] = createSignal(data$().title)

  const event: TableDataEventMap = createEvent()

  event.on$(TableDataEvent.UPDATE, (tableTabId, data) => {
    console.log('data at tab id', tableTabId, 'updated to', data)
  })

  return (
    <Context.Provider value={{
      title$: { 
        get$: title, 
        set$(value) {
          const newValue = setTitle(value)
          updateAttribute$('title', newValue)
          return newValue
        } 
      },
      event$: createEvent(),
      tabs$: tabs
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTablesDataContext() {
  return useContext(Context)!
}