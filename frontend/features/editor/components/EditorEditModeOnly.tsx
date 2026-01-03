import { Show, type ParentComponent, type ParentProps } from "solid-js";
import { useEditorContext } from "../provider";

interface IEditorEditModeOnlyProps {
  root$?: ParentComponent
}

export function EditorEditModeOnly(props: ParentProps<IEditorEditModeOnlyProps>) {
  const { isReadonly$ } = useEditorContext()

  if (props.root$) return (
    <Show when={!isReadonly$()} fallback={props.children}>
      <props.root$>
        {props.children}
      </props.root$>
    </Show>
  )
  
  return (
    <Show when={!isReadonly$()}>
      {props.children}
    </Show>
  )
}