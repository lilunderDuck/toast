import { Show } from "solid-js/web"
import { BsBookFill, BsPencilFill } from "solid-icons/bs"

export function EditOrReadonlyIcon() {
  return (
    <Show when={true} fallback={
      <BsBookFill size={15} />
    }>
      <BsPencilFill size={15} />
    </Show>
  )
}