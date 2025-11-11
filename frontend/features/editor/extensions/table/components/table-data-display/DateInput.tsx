import type { ITableDataTypeComponentProps } from "./TableDataItem"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  dateInput: {
    backgroundColor: "transparent"
  }
})

export default function DateInput(props: ITableDataTypeComponentProps<string>) {
  return (
    <div>
      <input type="date" {...stylex.attrs(style.dateInput)} />
    </div>
  )
}