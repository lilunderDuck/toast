import { Match, Switch } from "solid-js"
// ...
import { css } from "molcss"
// ...
import type { IconTheme, Renderable } from "../util"
import { Error, Loader, Success } from '.'

const iconContainer = css`
  flex-shrink: 0;
  min-width: 20px;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

interface IIconContainerProps {
  icon$?: Renderable
  theme$?: IconTheme
  type$: ToastType
}

export function ToastIconContainer(props: IIconContainerProps) {
  return (
    <div {...props} class={iconContainer}>
      <Switch>
        <Match when={props.icon$}>
          {props.icon$}
        </Match>
        <Match when={props.type$ === ToastType.LOADING}>
          <Loader {...props.theme$} />
        </Match>
        <Match when={props.type$ === ToastType.SUCCESS}>
          <Success {...props.theme$} />
        </Match>
        <Match when={props.type$ === ToastType.ERROR}>
          <Error {...props.theme$} />
        </Match>
      </Switch>
    </div>
  )
}