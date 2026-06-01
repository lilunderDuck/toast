import { Match, splitProps, Switch } from "solid-js"
// ...
import { css } from "molcss"
// ...
import type { HTMLAttributes } from "~/utils"
// ...
import { Spacer } from "../ui"

const buttonRow = css`
  gap: 10px;
  margin-top: 10px;
  user-select: none;
  display: flex;
  align-items: center;
`

interface IButtonRowProps extends HTMLAttributes<"div"> {
  direction$?: ButtonRowDirection
}

export function ButtonRow(props: IButtonRowProps) {
  const [, itsProps] = splitProps(props, ["direction$"])

  return (
    <div {...itsProps} class={`${buttonRow} ${props.class ?? ""}`}>
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