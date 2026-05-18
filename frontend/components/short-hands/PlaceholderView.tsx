import stylex from "@stylexjs/stylex"
import { CLS } from "macro-def"
// ...
import type { JSX, ParentProps } from "solid-js"

const style = stylex.create({
  placeholder: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    gap: 10,
    userSelect: "none"
  }
})

interface IPlaceholderViewProps {
  icons$: JSX.Element
  class?: string
}

export function PlaceholderView(props: ParentProps<IPlaceholderViewProps>) {
  return (
    <div class={`${CLS(style.placeholder)} ${props.class ?? ""}`}>
      <span>
        {props.icons$}
      </span>
      <div>{props.children}</div>
    </div>
  )
}