import type { ITableDataTypeComponentProps } from "./TableDataItem";

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  text__input: {
    width: "fit-content",
    fieldSizing: "content",
    padding: 0
  }
})

export default function TextInput(props: ITableDataTypeComponentProps<string>) {
  return (
    <div>
      <input 
        {...stylex.attrs(style.text__input)}
        type="text"
        placeholder="Empty"
        value={props.value$}
        onInput={(e) => {
          console.log(e.currentTarget.value)
          props.onChange$(e.currentTarget.value)
        }}
      />
    </div>
  )
}