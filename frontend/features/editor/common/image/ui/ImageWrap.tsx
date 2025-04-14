import { Component, JSX, ParentProps, Show } from "solid-js"
import { Tooltip } from "~/components"
// ...
import { useEditorContext } from "~/features/editor/provider"

interface IImageWrapProps {
  UploadZoneComponent$: Component<ParentProps>
  tooltipLabel$: JSX.Element
}

export function ImageWrap(props: ParentProps<IImageWrapProps>) {
  const { isReadonly$ } = useEditorContext()
  
  return (
    <Show when={!isReadonly$()} fallback={props.children}>
      <Tooltip label$={props.tooltipLabel$}>
        <props.UploadZoneComponent$>
          {props.children}
        </props.UploadZoneComponent$>
      </Tooltip>
    </Show>
  )
}