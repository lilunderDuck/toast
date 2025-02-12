import { type Component, createSignal, lazy, Show } from "solid-js"
import { Dialog } from "./Dialog"

export interface IDialog {
  close$(): void
}

type SomeLazyLoadedComponent<T extends {}> = ReturnType<typeof lazy<Component<T>>>
type LazyLoadedComponentProps<T extends Component> = Omit<Parameters<T>[0], 'close$'>

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