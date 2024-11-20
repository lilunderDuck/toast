import { createSignal, ParentProps, Show } from "solid-js"
import { Dialog } from "./Dialog"

export interface IDialog {
  $close(): void
}

export function createLazyLoadedDialog() {
  const [showing, setIsShowing] = createSignal(false)
  return {
    $Modal(props: ParentProps) {
      return (
        <Show when={showing()}>
          <Dialog defaultOpen={true} preventScroll={false} modal={true}>
            {props.children}
          </Dialog>
        </Show>
      )
    },
    $show() {
      setIsShowing(false)
      setIsShowing(true)
    },
    $close() {
      setIsShowing(false)
    }
  }
}