import { Show } from "solid-js/web"
import { BsBookFill, BsPencilFill } from "solid-icons/bs"
import { useEditorContext } from "../provider"
// ...

export function EditOrReadonlyIcon() {
  const { isReadonly$ } = useEditorContext()

  return (
    <Show when={isReadonly$()} fallback={
      <BsBookFill size={15} />
    }>
      <BsPencilFill size={15} />
    </Show>
  )
}