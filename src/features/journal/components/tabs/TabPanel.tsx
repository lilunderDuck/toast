import __style from "./tab.module.css"
import { type JSX, onMount, ParentProps, splitProps } from "solid-js"
import { ResizablePanel, type ResizablePanelProps } from "~/components"

export function TabPanel(props: ResizablePanelProps & ParentProps<{
  titleBar?: JSX.Element
}>) {
  const [, rest] = splitProps(props, ["titleBar"])
  let panelRef: HTMLDivElement

  return (
    <ResizablePanel {...rest} id={__style.tab} ref={panelRef!}>
      {props.titleBar}
      {props.children as JSX.Element}
    </ResizablePanel>
  )
}