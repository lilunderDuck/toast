import stylex from "@stylexjs/stylex"
import { type JSX, ParentProps, splitProps } from "solid-js"
import { FlexCenterY, ResizablePanel, type ResizablePanelProps } from "~/components"

const style = stylex.create({
  titleBar: {
    width: '100%',
    height: 30
  }
})

export function TabPanel(props: ResizablePanelProps & ParentProps<{
  titleBar?: JSX.Element
}>) {
  const [, rest] = splitProps(props, ["titleBar"])

  return (
    <ResizablePanel {...rest}>
      <FlexCenterY {...stylex.attrs(style.titleBar)}>
        {props.titleBar}
      </FlexCenterY>
      {props.children as JSX.Element}
    </ResizablePanel>
  )
}