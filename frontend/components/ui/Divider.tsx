import { css } from "molcss"

const divider = css`
  width: 100%;
  background-color: var(--divider-color);
  border-radius: 6px;
`

const divider__lineHorizontal = css`
  width: 100%;
  height: var(--divider-thickness);
`

const divider__lineVertical = css`
  height: 100%;
  width: var(--divider-thickness);
`

interface IDividerProps {
  color$?: string
  thicknessInPx$?: number
  variant$?: DividerVariant
  class?: string
}

export function Divider(props: IDividerProps) {
  return (
    <div 
      class={`${divider} ${props.variant$ === DividerVariant.VERTICAL ? divider__lineVertical : divider__lineHorizontal} ${props.class ?? ""}`}
      style={`--divider-color:${props.color$ ?? "var(--surface1)"};--divider-thickness:${props.thicknessInPx$ ?? 2}px`}
    />
  )
}