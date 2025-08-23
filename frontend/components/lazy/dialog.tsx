import { createSignal, Show } from "solid-js"
// ...
import type { LazyComponent, LazyComponentProps } from "./types"
import { Dialog } from "../ui"
import { createLazyComponent } from "./utils"

type LazyDialogComponent<Props extends {}> = LazyComponentProps<LazyComponent<Props>>

export interface IDialog {
  close$(): void
}

export function createLazyLoadedDialog<Props extends IDialog>(
  Component: LazyComponent<Props>, 
  // @ts-ignore  should work
  itProps: () => Omit<LazyDialogComponent<Props>, "close$"> = () => {}
) {
  const [showing, setIsShowing] = createSignal(false)
  const show = () => {
    setIsShowing(false)
    setIsShowing(true)
    console.log('[lazy dialog] shown')
  }

  const close = () => {
    setIsShowing(false)
    console.log('[lazy dialog] closed')
  }

  const LazyComponent = createLazyComponent(Component)

  return {
    Modal$() {
      return (
        <Show when={showing()}>
          <Dialog defaultOpen={true} preventScroll={false} modal={true}>
            <LazyComponent {...itProps() as LazyDialogComponent<Props>} close$={close} />
          </Dialog>
        </Show>
      )
    },
    show$: show,
    close$: close
  }
}