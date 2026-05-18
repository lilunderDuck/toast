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
  }
})

interface ICollectionLabelProps {
}

export function CollectionLabel(props: ParentProps<ICollectionLabelProps>) {
  return (
    <Label {...stylex.attrs(style.divider)}>
      {props.children}
    </Label>
  )
}