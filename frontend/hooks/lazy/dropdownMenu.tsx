import { createSignal, onCleanup, type ParentProps, Show } from "solid-js"
import {  } from "@kobalte/core/dropdown-menu"
// ...
import type { LazyComponent } from "./types"
import { DropdownMenu, DropdownMenuTrigger } from "../../components/ui"
import { createLazyComponent } from "./utils"

export interface IDropdownMenu {
  close$(): void
}

export function createLazyLoadedDropdownMenu<Props extends IDropdownMenu>(
  Component: LazyComponent<Props>, 
  // still no auto-complete on lazy loaded component for some reason...
  // @ts-ignore  should work
  itProps: () => Omit<LazyDialogComponent<Props>, "close$"> = () => {}
) {
  const [showing, setIsShowing] = createSignal(false)

  const show = () => {
    console.log("[lazy dropdown menu] show")
    setIsShowing(true)
  }
  
  const close = () => {
    console.log("[lazy dropdown menu] close")
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
    close$: close
  }
}