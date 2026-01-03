import { Show, type ParentComponent, type ParentProps } from "solid-js";
import { useEditorContext } from "../provider";

interface IEditorEditModeWrapperProps {
  root$: ParentComponent
}

export function EditorEditModeWrapper(props: ParentProps<IEditorEditModeWrapperProps>) {
  const { isReadonly$ } = useEditorContext()

  return (
    <Show when={!isReadonly$()} fallback={props.children}>
      <props.root$>
        {props.children}
      </props.root$>
    </Show>
  )
}