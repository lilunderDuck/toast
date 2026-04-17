import { Label } from "~/components"

import stylex from "@stylexjs/stylex"
import type { ParentProps } from "solid-js"

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
      <div  />
    </Label>
  )
}