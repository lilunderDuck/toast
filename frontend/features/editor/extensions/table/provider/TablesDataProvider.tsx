import { createContext, createSignal, onMount, type ParentProps, useContext } from "solid-js"
// ...
import { createTabs, type StateSlice, type TabsHandler } from "~/hooks"
import { createEvent, type IEvent } from "~/utils"
import type { editor } from "~/wailsjs/go/models"
import { CreateTable, CreateTableGrid, GetTable, UpdateTable, UpdateTableGrid } from "~/wailsjs/go/editor/Exports"
import { useSolidNodeView } from "~/libs/solid-tiptap-renderer"
import { createOrGetData } from "~/features/editor/utils"
// ...
import type { TableAttribute, TableEventMap } from "./data"

interface ITablesDataContext {
  title$: StateSlice<string>
  tabs$: TabsHandler<editor.TableTabData>
  updateTableGrid$(tableTabId: string, data: editor.TableGridData): Promise<void>
  readonly event$: TableEventMap
}

const Context = createContext<ITablesDataContext>()

interface ITablesDataProviderProps {
  // ...
}

export function TablesDataProvider(props: ParentProps<ITablesDataProviderProps>) {
  const { attrs$ } = useSolidNodeView<TableAttribute>()

  const tabs = createTabs<editor.TableTabData>([])
  const tableId = () => attrs$().id
  
  const [title, setTitle] = createSignal('')

  const updateTableGrid: ITablesDataContext["updateTableGrid$"] = async(tableTabId, data) => {
    console.assert(tableTabId !== '', "[table] table tab id must not be empty string")
    console.assert(tableId() !== "", "[table] table id must not be empty string")
    await UpdateTableGrid(tableId(), tableTabId, data)
    console.log('[table] update table grid:', tableTabId, data)
  }

  tabs.on$(TabEvent.CREATE, async(tabData) => {
    console.assert(tableId() !== "", "[table] table id must not be empty string")
    const newData = await CreateTableGrid(tableId(), tabData.id)
    console.log('[table] created new table grid:', newData)
  })

  tabs.on$(TabEvent.UPDATE, (tabsData) => {
    console.assert(tableId() !== "", "[table] table id must not be empty string")
    UpdateTable(tableId(), {
      tabs: tabsData
    } as editor.TableUpdateOption)
    console.log('[table] update table tab', tabsData)
  })

  onMount(async() => {
    const data = await createOrGetData<editor.TableMetadata>(
      tableId() === TABLE_DEFAULT_ID,
      CreateTable,
      () => GetTable(tableId())
    )

    console.log('[table] loaded data:', data)

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
      tabs$: tabs,
      event$: createEvent(),
      updateTableGrid$: updateTableGrid
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTablesDataContext() {
  return useContext(Context)!
}