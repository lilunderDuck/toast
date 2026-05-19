import { createSignal, Show } from "solid-js"
// ...
import type { LazyComponent, LazyComponentProps } from "./types"
import { Dialog } from "../../components/ui"
import { createLazyComponent } from "./utils"

type LazyDialogComponent<Props extends {}> = LazyComponentProps<LazyComponent<Props>>

export interface IBaseLazyDialog {
  close$(): void
}

export function createLazyLoadedDialog<Props extends IBaseLazyDialog>(
  Component: LazyComponent<Props>, 
  // @ts-ignore  should work
  itProps: () => Omit<LazyDialogComponent<Props>, "close$"> = () => {}
) {
  let stayLoaded = false
  const [showing, setIsShowing] = createSignal(false)
  const show = () => {
    setIsShowing(false)
    setIsShowing(true)
    console.log('[lazy dialog] shown')
    stayLoaded = true
  }

  const close = () => {
    setIsShowing(false)
    console.log('[lazy dialog] closed')
  }

  const LazyComponent = createLazyComponent(Component)

  return {
    Dialog$() {
      return (
        <Show when={stayLoaded || showing()}>
          <Dialog preventScroll={false} modal={true} open={showing()}>
            <LazyComponent {...itProps() as LazyDialogComponent<Props>} close$={close} />
          </Dialog>
        </Show>
      )
    },
    show$: show,
    close$: close
  }
}

export type LazyDialog<T extends IBaseLazyDialog = IBaseLazyDialog> = 
  ReturnType<typeof createLazyLoadedDialog<T>>