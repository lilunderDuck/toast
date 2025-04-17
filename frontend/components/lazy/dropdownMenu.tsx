import { createSignal, Show, type Component } from "solid-js"
// ...
import { lazyLoadComponent } from "~/features/debug"
// ...
import { LazyComponent, LazyComponentProps } from "./types"
import { DropdownMenu, DropdownMenuTrigger } from "../ui"
import { createLazyComponent } from "./utils"

export interface IDropdownMenu {
  // ...
}

export function createLazyLoadedDropdownMenu<Props extends IDropdownMenu>(
  TriggerComponent: Component,
  Component: LazyComponent<Props>, 
  // still no auto-complete on lazy loaded component for some reason...
  // @ts-ignore  should work
  itProps: () => LazyComponentProps<LazyComponent<Props>> = () => {}
) {
  const [showing, setIsShowing] = createSignal(false)
  const show = () => {
    setIsShowing(false)
    setIsShowing(true)
    isDevMode && lazyLoadComponent.logLabel("dropdown menu", 'show')
  }

  const close = () => {
    setIsShowing(false)
    isDevMode && lazyLoadComponent.logLabel("dropdown menu", 'hide')
  }

  const LazyComponent = createLazyComponent(Component)

  return {
    DropdownMenu$() {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger as="div" onClick={show}>
            <TriggerComponent />
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