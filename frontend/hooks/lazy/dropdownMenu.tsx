import { createSignal, type ParentProps, Show } from "solid-js"
// ...
import type { LazyComponent, LazyComponentProps } from "./types"
import { DropdownMenu, DropdownMenuTrigger } from "../../components/ui"
import { createLazyComponent } from "./utils"

export interface IDropdownMenu {
  // ...
}

export function createLazyLoadedDropdownMenu<Props extends IDropdownMenu>(
  Component: LazyComponent<Props>, 
  // still no auto-complete on lazy loaded component for some reason...
  // @ts-ignore  should work
  itProps: () => LazyComponentProps<LazyComponent<Props>> = () => {}
) {
  const [showing, setIsShowing] = createSignal(false)
  const show = () => {
    setIsShowing(false)
    setIsShowing(true)
  }

  const close = () => {
    setIsShowing(false)
  }

  const LazyComponent = createLazyComponent(Component)

  return {
    DropdownMenu$(props: ParentProps) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger as="div" onClick={show}>
            {props.children}
          </DropdownMenuTrigger>
          <Show when={showing()}>
            <LazyComponent {...itProps()} close$={close} />
          </Show>
        </DropdownMenu>
      )
    },
    show$: show,
    close$: close
  }
}