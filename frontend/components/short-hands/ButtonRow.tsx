import { Match, splitProps, Switch } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Spacer } from "../ui"

const style = stylex.create({
  buttonRow: {
    gap: 10,
    marginTop: 10,
    userSelect: "none",
    display: "flex",
    alignItems: "center"
  }
})

interface IButtonRowProps extends HTMLAttributes<"div"> {
  direction$?: ButtonRowDirection
}

export function ButtonRow(props: IButtonRowProps) {
  const [, itsProps] = splitProps(props, ["direction$"])

  return (
    <div {...itsProps} class={`${stylex.attrs(style.buttonRow).class} ${props.class ?? ""}`}>
      <Switch fallback={
        <>
          <Spacer />
          {props.children}
        </>
      }>
        <Match when={props.direction$ === ButtonRowDirection.CUSTOM}>
          {props.children}
        </Match>
        <Match when={props.direction$ === ButtonRowDirection.MIDDLE}>
          <Spacer />
          {props.children}
          <Spacer />
        </Match>
        <Match when={props.direction$ === ButtonRowDirection.LEFT}>
          {props.children}
          <Spacer />
        </Match>
        <Match when={props.direction$ === ButtonRowDirection.RIGHT}>
          <Spacer />
          {props.children}
        </Match>
      </Switch>
    </div>
  )
}