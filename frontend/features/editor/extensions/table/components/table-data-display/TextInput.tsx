import type { ITableDataTypeComponentProps } from "./TableDataItem";

export default function TextInput(props: ITableDataTypeComponentProps<string>) {
  return (
    <div>
      <input 
        type="text"
        value={props.value$}
        onInput={(e) => {
          console.log(e.currentTarget.value)
          props.onChange$(e.currentTarget.value)
        }}
      />
    </div>
  )
}