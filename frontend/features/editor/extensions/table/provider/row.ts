import { createSignal, type Accessor, type Setter } from "solid-js";
import { type RowData, type TableDefaultValueMapping } from "./data";
import { arrayObjects } from "~/utils";

export interface IRowManager {
  get$: Accessor<RowData[]>
  set$: Setter<RowData[]>
  updateData$<T extends TableDataType>(
    rowIndex: number, 
    columnKey: string, 
    data: TableDefaultValueMapping<T>
  ): void
}

export function createRowsManager(
  initialRows: RowData[], 
  onDataUpdate: AnyNoArgsFunction
): IRowManager {
  const [rows, setRows] = createSignal(initialRows)

  const updateData: IRowManager["updateData$"] = (rowIndex, columnKey, data) => {
    const rowData = rows()[rowIndex]
    console.assert(rowData, `No row data exist in index: ${rowIndex}`)

    setRows((prev) => arrayObjects(prev).replace$(it => it[columnKey], {
      [columnKey]: data
    }))

    console.log("Row data at index", rowIndex, "updated to", rows()[rowIndex])
    onDataUpdate()
  }

  return {
    get$: rows,
    set$: setRows,
    updateData$: updateData,
  }
}