import { createSignal, Show, type Component } from "solid-js"
import { SomeLazyLoadedComponent } from "./types"
import { DropdownMenu, DropdownMenuTrigger } from "../ui"

export interface IDropdownMenu {
  // ...
}

export function createLazyLoadedDropdownMenu<Props extends IDropdownMenu>(
  TriggerComponent: Component,
  Component: SomeLazyLoadedComponent<Props>, 
  // @ts-ignore  should work
  itProps: () => LazyLoadedComponentProps<SomeLazyLoadedComponent<Props>> = () => {}
) {
  const [showing, setIsShowing] = createSignal(false)
  const show = () => {
    setIsShowing(false)
    setIsShowing(true)
    console.log('[lazy dropdown menu] shown')
  }

  const close = () => {
    setIsShowing(false)
    console.log('[lazy dropdown menu] closed')
  }

  return {
    DropdownMenu$() {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger as="div" onClick={show}>
            <TriggerComponent />
          </DropdownMenuTrigger>
          <Show when={showing()}>
            <Component {...itProps()} close$={close} />
          </Show>
        </DropdownMenu>
      )
    },
    show$: show,
    close$: close
  }
}