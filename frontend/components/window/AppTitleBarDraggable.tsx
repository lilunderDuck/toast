import { css } from "molcss"

const titleBar = css`
  height: var(--title-bar-thiccness);
  width: 100%;
  user-select: none;
  display: flex;
  align-items: center;
  z-index: 9;
`

export function AppTitleBarDraggable(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={`${titleBar} ${props.class ?? ""}`} style="--wails-draggable: drag" />
  )
}