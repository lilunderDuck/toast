import type { ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import "~/styles/shorthand.css"
// ...
import { Label } from "~/components"

const style = stylex.create({
  divider: {
    width: "100%",
    paddingInline: 5,
    paddingBlock: 10,
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  divider__line: {
    width: "100%",
    height: 1,
    backgroundColor: "var(--overlay0)"
  }
})

interface ICollectionDividerProps {
}

export function CollectionDivider(props: ParentProps<ICollectionDividerProps>) {
  return (
    <Label {...stylex.attrs(style.divider)}>
      {props.children}
    </Label>
  )
}