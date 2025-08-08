import { Ref } from "./ref"
import { Component, JSX, splitProps } from "solid-js"
import { Dynamic } from "solid-js/web"

export interface NodeViewContentProps {
  [key: string]: unknown
  style?: JSX.CSSProperties
  ref?: Ref<Element>
  as?: string | Component<Record<string, unknown>>
}

export function NodeViewContent(props: NodeViewContentProps) {
  const [local, otherProps] = splitProps(props, ["ref"])

  return (
    <Dynamic
      {...otherProps}
      component={props.as || "div"}
      ref={local.ref ? local.ref[1] : null}
      data-node-view-content=""
      style={{
        ...props.style,
        whiteSpace: "pre-wrap"
      }}
    />
  )
}