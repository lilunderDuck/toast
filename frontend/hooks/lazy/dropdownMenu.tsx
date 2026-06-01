import { createSignal, lazy, type ParentProps, Show } from "solid-js"
// ...
import type { LazyComponent } from "./types"
import { DropdownMenu, DropdownMenuTrigger } from "../../components/ui"

export interface IBaseDropdownMenu {
  close$(): void
}

interface IDropdownMenuProps {
  onOpen$?: (isOpened: boolean) => void
}

type OtherDropdownMenuProps<Props extends IBaseDropdownMenu> = () => Omit<Props, "close$">

export function createLazyLoadedDropdownMenu<Props extends IBaseDropdownMenu>(
  Component: LazyComponent<Props>, 
  itProps = (() => {}) as OtherDropdownMenuProps<Props>
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

  const LazyComponent = lazy(Component)

  return {
    DropdownMenu$(props: ParentProps<IDropdownMenuProps>) {
      return (
        <DropdownMenu onOpenChange={props.onOpen$}>
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