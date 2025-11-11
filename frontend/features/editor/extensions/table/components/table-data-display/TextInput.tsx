import type { ITableDataTypeComponentProps } from "./TableDataItem";

export default function TextInput(props: ITableDataTypeComponentProps<string>) {
  return (
    <div>
      <input 
        type="text"
        value={props.value$}
        onChange={(e) => props.onChange$(e.currentTarget.value)}
      />
    </div>
  )
}