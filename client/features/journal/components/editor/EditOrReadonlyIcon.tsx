import { Show } from "solid-js/web"
import { BsBookFill, BsPencilFill } from "solid-icons/bs"
import { useThisEditorContext } from "client/features/editor"

export function EditOrReadonlyIcon() {
  const { isEditable$ } = useThisEditorContext()

  return (
    <Show when={isEditable$()} fallback={
      <BsBookFill size={15} />
    }>
      <BsPencilFill size={15} />
    </Show>
  )
}