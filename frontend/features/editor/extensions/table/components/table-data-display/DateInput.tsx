import { useEditorContext } from "~/features/editor/provider"
import type { ITableDataTypeComponentProps } from "./TableDataItem"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  dateInput: {
    backgroundColor: "transparent"
  }
})

export default function DateInput(props: ITableDataTypeComponentProps<string>) {
  const { isReadonly$ } = useEditorContext()  

  return (
    <div>
      <input type="date" {...stylex.attrs(style.dateInput)} disabled={isReadonly$()} />
    </div>
  )
}