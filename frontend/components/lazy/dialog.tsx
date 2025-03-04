import { createSignal, Show } from "solid-js"
import { SomeLazyLoadedComponent } from "./types"
import { Dialog } from "../ui"

export interface IDialog {
  close$(): void
}

export function createLazyLoadedDialog<Props extends IDialog>(
  Component: SomeLazyLoadedComponent<Props>, 
  // @ts-ignore  should work
  itProps: () => LazyLoadedComponentProps<SomeLazyLoadedComponent<Props>> = () => {}
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

  return {
    Modal$() {
      return (
        <Show when={showing()}>
          <Dialog defaultOpen={true} preventScroll={false} modal={true}>
            <Component {...itProps()} close$={close} />
          </Dialog>
        </Show>
      )
    },
    show$: show,
    close$: close
  }
}