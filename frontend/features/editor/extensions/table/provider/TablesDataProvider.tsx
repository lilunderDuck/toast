import { createContext, createSignal, onMount, type ParentProps, useContext } from "solid-js"
// ...
import { createTabs, type StateSlice, type TabsHandler } from "~/hooks"
import { createEvent, type IEvent } from "~/utils"
import type { editor } from "~/wailsjs/go/models"
import { CreateTable, CreateTableGrid, GetTable, UpdateTable, UpdateTableGrid } from "~/wailsjs/go/editor/Exports"
import { useSolidNodeView } from "~/libs/solid-tiptap-renderer"
import { createOrGetData } from "~/features/editor/utils"
// ...
import type { TableAttribute } from "./data"

type TableDataEventMap = IEvent<{
  [TableDataEvent.UPDATE]: (tableTabId: string, data: editor.TableGridData) => any
}>

interface ITablesDataContext {
  event$: TableDataEventMap
  title$: StateSlice<string>
  tabs$: TabsHandler<editor.TableTabData>
}

const Context = createContext<ITablesDataContext>()

interface ITablesDataProviderProps {
  // ...
}

export function TablesDataProvider(props: ParentProps<ITablesDataProviderProps>) {
  const { attrs$ } = useSolidNodeView<TableAttribute>()

  const event: TableDataEventMap = createEvent()
  const tabs = createTabs<editor.TableTabData>([])
  const tableId = () => attrs$().id
  
  const [title, setTitle] = createSignal('')

  event.on$(TableDataEvent.UPDATE, (tableTabId, data) => {
    UpdateTableGrid(tableId(), tableTabId, data)
  })

  tabs.on$(TabEvent.CREATE, (tabData) => {
    CreateTableGrid(tableId(), tabData.id)
  })

  tabs.on$(TabEvent.UPDATE, (tabsData) => {
    UpdateTable(tableId(), {
      tabs: tabsData
    } as editor.TableUpdateOption)
  })

  onMount(async() => {
    console.log(attrs$())
    const data = await createOrGetData<editor.TableMetadata>(
      tableId() === TABLE_DEFAULT_ID,
      CreateTable,
      () => GetTable(tableId())
    )

    console.log(data)

    setTitle(data.title)
    tabs.set$(data.tabs)
  })

  return (
    <Context.Provider value={{
      title$: { 
        get$: title, 
        set$(value) {
          const newValue = setTitle(value)
          UpdateTable(tableId(), { 
            title: newValue as string
          } as editor.TableUpdateOption)
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