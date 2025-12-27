import { createSignal, Show, type ParentProps } from "solid-js"
// ...
import type { LazyComponent } from "./types"
import { ContextMenu, ContextMenuTrigger } from "../../components/ui"
import { createLazyComponent } from "./utils"

export interface IContextMenu {
  // ...
}

export function createLazyLoadedContextMenu<Props extends IContextMenu>(
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
    ContextMenu$(props: ParentProps) {
      return (
        <ContextMenu>
          <ContextMenuTrigger as="div" onMouseUp={(e) => {
            if (e.button === RIGHT_CLICK) {
              show()
            }
          }}>
            {props.children}
          </ContextMenuTrigger>
          <Show when={showing()}>
            <LazyComponent {...itProps()} close$={close} />
          </Show>
        </ContextMenu>
      )
    }
  }
}