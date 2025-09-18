import { type SolidNodeViewContextProps, useSolidNodeView, type Attrs } from "./useSolidNodeView"
import { type Component, type JSX, splitProps } from "solid-js"
import { Dynamic } from "solid-js/web"

export interface NodeViewWrapperProps {
  [key: string]: unknown
  style?: JSX.CSSProperties
  ref?: Element
  as?: string | Component<Record<string, unknown>>
}

export function NodeViewWrapper<T extends HTMLTags>(props: HTMLAttributes<T> & {
  as?: T
}) {
  const { state } = useSolidNodeView() as SolidNodeViewContextProps<Attrs>
  const [local, otherProps] = splitProps(props, ["as"])

  return (
    // @ts-ignore
    <Dynamic
      component={local.as || "div"}
      {...otherProps}
      onDragStart={state().onDragStart}
      data-node-view-wrapper=""
    />
  )
}