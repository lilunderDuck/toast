import stylex from "@stylexjs/stylex"
import { mergeClassname } from "~/utils"
import { shorthands } from "~/styles/shorthands"
import { Match, mergeProps, Show, splitProps, Switch } from "solid-js"
import { Spacer } from "../ui"

const style = stylex.create({
  buttonRow: {
    gap: 10,
    marginTop: 10,
    userSelect: "none"
  }
})

interface IButtonRowProps extends HTMLAttributes<"div"> {
  direction$?: "direction_left$" | "direction_right$" | "direction_middle$" | "custom$"
}

export function ButtonRow(props: IButtonRowProps) {
  const [, itsProps] = splitProps(props, ["direction$"])

  return (
    <div {...itsProps} class={mergeClassname(props, stylex.attrs(style.buttonRow, shorthands.flex_y_center$))}>
      <Switch fallback={
        <>
          <Spacer />
          {props.children}
        </>
      }>
        <Match when={props.direction$ === "custom$"}>
          {props.children}
        </Match>
        <Match when={props.direction$ === "direction_middle$"}>
          <Spacer />
          {props.children}
          <Spacer />
        </Match>
        <Match when={props.direction$ === "direction_left$"}>
          {props.children}
          <Spacer />
        </Match>
        <Match when={props.direction$ === "direction_right$"}>
          <Spacer />
          {props.children}
        </Match>
      </Switch>
    </div>
  )
}