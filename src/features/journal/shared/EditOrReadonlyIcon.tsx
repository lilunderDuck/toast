import { Show } from "solid-js/web"
import { BsBookFill, BsPencilFill } from "solid-icons/bs"
import { ThisEditor } from "~/libs/editor"

export function EditOrReadonlyIcon() {
  return (
    <Show when={ThisEditor.$isEditable()} fallback={
      <BsBookFill size={15} />
    }>
      <BsPencilFill size={15} />
    </Show>
  )
}