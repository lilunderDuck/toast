import { type VoidComponent } from "solid-js"
// ...
import { useTableContext } from "../../provider"
import NumberInput from "./NumberInput"
import CheckboxInput from "./CheckboxInput"
import DateInput from "./DateInput"
import TextInput from "./TextInput"
import LinkInput from "./LinkInput"
import ProgressBarInput from "./ProgressBarInput"
import TagInput from "./tags"
import type { RowItemComponentProps } from "../table/stuff"

export interface ITableDataTypeComponentProps<Type = any> {
  onChange$(value: Type): any
  value$: Type
  additionalData$?: any
  columnKey$: string
}

const DATA_ITEM_COMPONENT_MAPPING: Record<TableDataType, VoidComponent<ITableDataTypeComponentProps>> = {
  [TableDataType.PROGRESS]: ProgressBarInput,
  [TableDataType.DATE]: DateInput,
  [TableDataType.CHECKBOX]: CheckboxInput,
  [TableDataType.NUMBER]: NumberInput,
  [TableDataType.LINK]: LinkInput,
  [TableDataType.TAG]: TagInput,
  [TableDataType.TEXT]: TextInput,
}

export function TableDataItem(props: RowItemComponentProps) {
  const { rows$ } = useTableContext()
  const DataComponent = DATA_ITEM_COMPONENT_MAPPING[props.type]
  console.assert(DataComponent, `Missing component or invalid data type for type: ${props.type}`)

  return (
    <DataComponent
      onChange$={(value) => rows$.updateData$(props.index$(), props.key, value)}
      value$={props.value$}
      additionalData$={props.additionalData}
      columnKey$={props.key}
    />
  )
}