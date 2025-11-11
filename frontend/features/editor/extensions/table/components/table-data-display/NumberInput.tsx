import type { ITableDataTypeComponentProps } from "./TableDataItem"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  input: {
    outline: "none",
    backgroundColor: "transparent"
  }
})

export default function NumberInput(props: ITableDataTypeComponentProps<number>) {
  return (
    <input 
      type="number"
      value={props.value$}
      onInput={(inputEvent) => props.onChange$(parseFloat(inputEvent.currentTarget.value))}
      {...stylex.attrs(style.input)}
    />
  )
}