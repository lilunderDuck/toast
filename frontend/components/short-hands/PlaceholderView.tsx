import { css } from "molcss"
// ...
import type { JSX, ParentProps } from "solid-js"

const placeholderView = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 10px;
  user-select: none;
`

interface IPlaceholderViewProps {
  icons$: JSX.Element
  class?: string
}

export function PlaceholderView(props: ParentProps<IPlaceholderViewProps>) {
  return (
    <div class={`${placeholderView} ${props.class ?? ""}`}>
      <span>
        {props.icons$}
      </span>
      <div>{props.children}</div>
    </div>
  )
}