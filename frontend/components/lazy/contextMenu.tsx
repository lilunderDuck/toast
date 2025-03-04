import { createSignal, Show, type Component } from "solid-js"
import { SomeLazyLoadedComponent } from "./types"
import { ContextMenu, ContextMenuTrigger } from "../ui"

export interface IContextMenu {
  // ...
}

export function createLazyLoadedContextMenu<Props extends IContextMenu>(
  TriggerComponent: Component,
  Component: SomeLazyLoadedComponent<Props>, 
  // @ts-ignore  should work
  itProps: () => LazyLoadedComponentProps<SomeLazyLoadedComponent<Props>> = () => {}
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

  return {
    ContextMenu$() {
      return (
        <ContextMenu>
          <ContextMenuTrigger as="div" onMouseUp={(e) => {
            if (e.button === 2) {
              show()
            }
          }}>
            <TriggerComponent />
          </ContextMenuTrigger>
          <Show when={showing()}>
            <Component {...itProps()} close$={close} />
          </Show>
        </ContextMenu>
      )
    }
  }
}