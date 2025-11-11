import { createContext, type ParentProps, useContext } from "solid-js"
// ...
import { createStateSlice, type StateSlice } from "~/hooks"
import { makeId } from "~/utils"
// ...
import type { ColumnData, RowData } from "./data"
import { createColumnsManager, type IColumnsManager } from "./column"
import { createRowsManager, type IRowManager } from "./row"
import { useTablesDataContext } from "./TablesDataProvider"
import { getTableDefaultData } from "../utils"

interface ITableContext {
  readonly rows$: IRowManager
  readonly columns$: IColumnsManager
  // ...
  draggedRowIndex$: StateSlice<number | undefined>
  draggedColumnIndex$: StateSlice<number | undefined>
  resizingColumnIndex$: StateSlice<number | undefined>
  columnWidths$: StateSlice<number[]>
  startX$: StateSlice<number | undefined>
  // ...
  createRow$(): void
  createColumn$(label: string, type: TableDataType): void
}

const Context = createContext<ITableContext>()

interface ITableProviderProps {
  columns$: ColumnData[]
  rows$: RowData[]
  tabId$: string
}

export function TableProvider(props: ParentProps<ITableProviderProps>) {
  const { event$ } = useTablesDataContext()

  const updateData = () => {
    event$.emit$(TableDataEvent.UPDATE, props.tabId$, {
      columns: columnsManager.get$(),
      rows: rowsManager.get$()
    })
  }

  const columnsManager = createColumnsManager(props.columns$, updateData)
  const rowsManager = createRowsManager(props.rows$, updateData)

  const createRow = () => {
    const newData: RowData = {}
    for (const column of columnsManager.get$()) {
      newData[column.key] = getTableDefaultData(column.type)
    }

    rowsManager.set$([...rowsManager.get$(), newData])
    console.log("Added new row", newData, rowsManager.get$())
    updateData()
  }

  const createColumn: ITableContext["createColumn$"] = (label, type) => {
    const rows = rowsManager.get$()
    const newColumn: ColumnData = {
      label: label,
      type: type,
      key: makeId(6),
      additionalData: undefined
    }

    for (const row of rows) {
      row[newColumn.key] = getTableDefaultData(newColumn.type)
    }

    rowsManager.set$(rows)
    columnsManager.set$(prev => [...prev, newColumn])
    updateData()
  }

  return (
    <Context.Provider value={{
      columns$: columnsManager,
      rows$: rowsManager,
      // ...
      draggedRowIndex$: createStateSlice(),
      draggedColumnIndex$: createStateSlice(),
      resizingColumnIndex$: createStateSlice(),
      columnWidths$: createStateSlice([0]),
      startX$: createStateSlice(),
      // ...
      createColumn$: createColumn,
      createRow$: createRow
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTableContext() {
  return useContext(Context)!
}