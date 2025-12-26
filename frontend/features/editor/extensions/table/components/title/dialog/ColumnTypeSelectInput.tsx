import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components"

import stylex from "@stylexjs/stylex"
import { TABLE_DATA_TYPE_MAPPING, TABLE_DATA_TYPES } from "../../../provider"

const style = stylex.create({
  select__item: {
    display: "flex",
    gap: 15,
  }
})

interface IColumnTypeSelectInputProps {
  value$?: TableDataType
  onChange$(value: TableDataType): any
}

export default function ColumnTypeSelectInput(props: IColumnTypeSelectInputProps) {
  return (
    <>
      <Label>Data type</Label>
      <Select
        value={props.value$}
        // @ts-ignore
        onChange={props.onChange$}
        options={TABLE_DATA_TYPES}
        placeholder="Select a column type"
        itemComponent={(props) => {
          return (
            <SelectItem item={props.item}>
              <ColumnTypeItem value$={props.item.rawValue} />
            </SelectItem>
          )
        }}
      >
        <SelectTrigger>
          <SelectValue<string>>
            {(state) => <ColumnTypeItem value$={parseInt(state.selectedOption())} />}
          </SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    </>
  )
}

function ColumnTypeItem(props: { value$: TableDataType }) {
  const tableType = () => TABLE_DATA_TYPE_MAPPING[props.value$]
  console.assert(tableType, `Missing icon or invalid data type in the mapping for type: ${props.value$}`)
  return (
    <div {...stylex.attrs(style.select__item)}>
      {/* Hacky way to update the icon. Do not try this at home. */}
      {tableType().icon$({})}
      {tableType().displayName$}
    </div>
  )
}