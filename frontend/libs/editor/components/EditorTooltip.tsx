import { Show } from "solid-js"
// ...
import { Tooltip, type ITooltipProps } from "~/components"
// ...
import { useEditorContext } from "../provider"

export function EditorTooltip(props: ITooltipProps) {
  const { isReadonly$ } = useEditorContext()

  return (
    <Show when={isReadonly$()} fallback={
      <Tooltip {...props}>
        {props.children}
      </Tooltip>
    }>
      {props.children}
    </Show>
  )
}