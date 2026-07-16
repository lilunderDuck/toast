import { DEBUG_ERR_LABEL, DEBUG_INFO_LABEL } from "macro-def"
import { createSignal, lazy, Show, type Component, type ParentComponent, type VoidComponent } from "solid-js"
import { ContextMenu, ContextMenuTrigger, Dialog, DropdownMenu, DropdownMenuTrigger } from "~/components"

type LazyFn<Props extends {}> = typeof lazy<Component<Props>>

// And now, we shall start our party with black magik.
type TargetedLazyComponent<Props extends {}> = Parameters<LazyFn<Props>>[0]

export interface IBaseLazyComponent {
  close$(): void
}

type LazyComponentProps<C extends TargetedLazyComponent<any>> = Awaited<ReturnType<C>>["default"]

type TargetedLazyComponentPropsRef<Props extends {}> = () => Omit<Parameters<
  LazyComponentProps<TargetedLazyComponent<Props>>
>[0], "close$">

type LazyComponentHandlerMapping = {
  [LazyComponentType.DIALOG]: {
    Component$: VoidComponent
    show$(): void
    close$(): void
  }
  [LazyComponentType.CONTEXT_MENU]: {
    Component$: ParentComponent
  }
  [LazyComponentType.DROPDOWN_MENU]: {
    Component$: ParentComponent<{
      onOpen$?: (isOpened: boolean) => void
    }>
    close$(): void
  }
}

// I've commited a sin while writting all of these.
export function createLazyComponent<Props extends IBaseLazyComponent, Type extends LazyComponentType>(
  type: Type,
  Component: TargetedLazyComponent<Props>,
  itsProps = (() => {}) as TargetedLazyComponentPropsRef<Props>
  // @ts-ignore - all case has been handled, but typescript still yell: 
  //   Function lacks ending return statement and return type does not include 'undefined'.
): LazyComponentHandlerMapping[Type] {
  let stayLoaded = false
  const [showing, setIsShowing] = createSignal(false)
  const show = () => {
    setIsShowing(false)
    setIsShowing(true)
    DEBUG_INFO_LABEL('LazyComponent', 'shown')
    stayLoaded = true
  }

  const close = () => {
    setIsShowing(false)
    DEBUG_INFO_LABEL('LazyComponent', 'closed')
  }

  const LazyComponent = lazy(Component)
  const RIGHT_CLICK = 2

  // oh god, what have I done...
  switch (type) {
    case LazyComponentType.DIALOG: return {
      Component$: () => (
        <Show when={stayLoaded || showing()}>
          <Dialog preventScroll$={false} open$={showing()}>
            <LazyComponent {...itsProps() as Props} close$={close} />
          </Dialog>
        </Show>
      ),
      show$: show,
      close$: close
    } as LazyComponentHandlerMapping[LazyComponentType.DIALOG] as any
    // cast to "any" because typescript just sucks at infering all of the stuff inside
    // this switch statement here.
    // 
    // the better way is we can put a throw new Error("wrong house my boy") statment at the below.
    // 
    // but seems like even with handling all of the cases, typescript STILL not sure, god darn it!!.

    case LazyComponentType.CONTEXT_MENU: return {
      Component$: (props) => (
        <ContextMenu>
          <ContextMenuTrigger as="div" onMouseUp={(e) => {
            if (e.button === RIGHT_CLICK) show()
          }}>
            {props.children}
          </ContextMenuTrigger>
          <Show when={stayLoaded || showing()}>
            <LazyComponent {...itsProps() as Props} close$={close} />
          </Show>
        </ContextMenu>
      )
    } as LazyComponentHandlerMapping[LazyComponentType.CONTEXT_MENU] as any

    case LazyComponentType.DROPDOWN_MENU: return {
      Component$: (props) => (
        <DropdownMenu onOpenChange={props.onOpen$}>
          <DropdownMenuTrigger as="div" onClick={show}>
            {props.children}
          </DropdownMenuTrigger>
          <Show when={stayLoaded || showing()}>
            <LazyComponent {...itsProps() as Props} close$={close} />
          </Show>
        </DropdownMenu>
      ),
      close$: close
    } as LazyComponentHandlerMapping[LazyComponentType.DROPDOWN_MENU] as any

    default:
      DEBUG_ERR_LABEL("LazyComponent", "case", type, "is not being handled or invalid type.")
    break
  }
}