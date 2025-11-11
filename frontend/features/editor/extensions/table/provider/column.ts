import { createSignal, type Accessor, type Setter } from "solid-js"
// ...
import { arrayObjects } from "~/utils"
// ...
import type { ColumnData } from "./data"

export interface IColumnsManager {
  get$: Accessor<ColumnData[]>
  set$: Setter<ColumnData[]>
  updateData$<T extends ColumnData>(
    columnId: string,
    data: (prev: T) => Partial<T>
  ): void
}

export function createColumnsManager(
  initialColumns: ColumnData[],
  onDataUpdate: AnyNoArgsFunction
): IColumnsManager {
  const [columns, setColumns] = createSignal(initialColumns)

  const updateColumn: IColumnsManager["updateData$"] = (
    columnId,
    data
  ) => {
    const columnArray = arrayObjects(columns())
    const [previousData] = columnArray.find$(it => it.key === columnId)
    console.assert(previousData, `Could not find column id: "${columnId}". Weird stuff may happen.`)
    let newData = data(previousData as any)

    console.log("New data", newData)

    setColumns(columnArray.replace$(it => it.key === columnId, newData))

    console.log("Updated additional data for", columnId, "->", columnArray.find$(it => it.key === columnId)[0])
    onDataUpdate()
  }

  return {
    get$: columns,
    set$: setColumns,
    updateData$: updateColumn
  }
}