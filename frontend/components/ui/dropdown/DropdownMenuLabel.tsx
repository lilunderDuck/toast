import { splitProps } from "solid-js"
import stylex from "@stylexjs/stylex"
import { CLS } from "macro-def"

const style = stylex.create({
  menuLabel: {
    paddingInline: '0.5rem',
    paddingBlock: '0.375rem',
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 600
  }
})

export interface IDropdownMenuLabel extends HTMLAttributes<"div"> {
  inset?: boolean
}

export function DropdownMenuLabel(props: IDropdownMenuLabel) {
  const [, rest] = splitProps(props, ["class", "inset"])
  return (
    <div
      class={`${CLS(style.menuLabel)} ${props.class ?? ""}`}
      {...rest}
    />
  )
}