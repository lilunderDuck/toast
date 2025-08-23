import { createSignal, Show, type Component } from "solid-js"
// ...
import type { LazyComponent } from "./types"
import { ContextMenu, ContextMenuTrigger } from "../ui"
import { createLazyComponent } from "./utils"

export interface IContextMenu {
  // ...
}

export function createLazyLoadedContextMenu<Props extends IContextMenu>(
  TriggerComponent: Component,
  Component: LazyComponent<Props>, 
  // @ts-ignore  should work
  itProps: () => LazyComponentProps<LazyComponent<Props>> = () => {}
) {
  const [showing, setIsShowing] = createSignal(false)
  const show = () => {
    setIsShowing(true)
    console.log('[lazy context menu] shown')
  }

  const close = () => {
    setIsShowing(false)
    console.log('[lazy context menu] closed')
  }

  const RIGHT_CLICK = 2
  const LazyComponent = createLazyComponent(Component)

  return {
    ContextMenu$() {
      return (
        <ContextMenu>
          <ContextMenuTrigger as="div" onMouseUp={(e) => {
            if (e.button === RIGHT_CLICK) {
              show()
            }
          }}>
            <TriggerComponent />
          </ContextMenuTrigger>
          <Show when={showing()}>
            <LazyComponent {...itProps()} close$={close} />
          </Show>
        </ContextMenu>
      )
    }
  }
}