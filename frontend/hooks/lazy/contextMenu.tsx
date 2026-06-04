import { createSignal, lazy, Show, type ParentProps } from "solid-js"
// ...
import type { LazyComponent } from "./types"
import { ContextMenu, ContextMenuTrigger } from "../../components/ui"
import { DEBUG_INFO_LABEL } from "macro-def"

export interface IBaseContextMenu {
  // ...
}

export function createLazyLoadedContextMenu<Props extends IBaseContextMenu>(
  Component: LazyComponent<Props>, 
  // @ts-ignore  should work
  itProps: () => LazyComponentProps<LazyComponent<Props>> = () => {}
) {
  const [showing, setIsShowing] = createSignal(false)
  const show = () => {
    setIsShowing(true)
    DEBUG_INFO_LABEL('lazy/ContextMenu', 'shown')
  }

  const close = () => {
    setIsShowing(false)
    DEBUG_INFO_LABEL('lazy/ContextMenu', 'closed')
  }

  const RIGHT_CLICK = 2
  const LazyComponent = lazy(Component)

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