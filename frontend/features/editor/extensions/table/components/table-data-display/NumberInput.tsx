import { useEditorContext } from "~/features/editor/provider"
import type { ITableDataTypeComponentProps } from "./TableDataItem"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  input: {
    outline: "none",
    backgroundColor: "transparent"
  }
})

export default function NumberInput(props: ITableDataTypeComponentProps<number>) {
  const { isReadonly$ } = useEditorContext()

  return (
    <input 
      type="number"
      disabled={isReadonly$()}
      value={props.value$}
      onInput={(inputEvent) => props.onChange$(parseFloat(inputEvent.currentTarget.value))}
      {...stylex.attrs(style.input)}
    />
  )
}