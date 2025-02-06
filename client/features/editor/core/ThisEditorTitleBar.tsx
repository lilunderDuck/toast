import stylex from "@stylexjs/stylex"
import { FlexCenter } from "~/components"

const style = stylex.create({
  titleBar: {
    height: 30,
    width: '100%',
    fontSize: 13,
    marginBottom: 10
  }
})

interface ITitleBarProps {
  name?: string
}

export function ThisEditorTitleBar(props: ITitleBarProps) {
  return (
    <FlexCenter {...stylex.attrs(style.titleBar)}>
      {props.name ?? 'No file opened'}
    </FlexCenter>
  )
}