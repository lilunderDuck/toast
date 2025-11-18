import stylex from "@stylexjs/stylex"
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
}

export function PlaceholderView(props: ParentProps<IPlaceholderViewProps>) {
  return (
    <div {...stylex.attrs(style.placeholder)}>
      <span>
        {props.icons$}
      </span>
      <div>{props.children}</div>
    </div>
  )
}