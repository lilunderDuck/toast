import stylex from "@stylexjs/stylex"
import { useEditorContext } from "~/features/editor/provider"

const style = stylex.create({
  breakLine: {
    flexBasis: '100%'
  },
  breakLineOnReadonly: {
    padding: 7,
    width: '100%'
  }
})

export function BreakLine() {
  const { isReadonly$ } = useEditorContext()
  
  return (
    <div {...stylex.attrs(isReadonly$() ? style.breakLineOnReadonly : style.breakLine)} />
  )
}