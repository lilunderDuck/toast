import type { JSX } from "solid-js"
import { Show, splitProps } from "solid-js"
import { Portal } from "solid-js/web"
// ...
import '~/styles/scrollbar.css'
import { css } from "molcss"
// ...
import { AppTitleBarDraggable } from "~/components/window"
import type { HTMLAttributes } from "~/utils"
// ...
import type { IDialogPortalProps } from "./types"
import { useDialogContext } from "./DialogContext"

const dialog__portal = css`
  z-index: 30;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  // alignItems: flex-start;
  align-items: center;
`

const dialog__overlay = css`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 30;
  backdrop-filter: blur(3px);
  background-color: #11111b8d;
`

const dialog__content = css`
  padding-inline: 15px;
  padding-block: 10px;
  background-color: var(--mantle);
  position: relative;
  outline: none;
`

const dialog__closeButton = css`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  opacity: 0.7;
  z-index: 10;
  outline: none;
  background-color: var(--surface1);
  &:hover {
    opacity: 1;
  }
`

const dialog__footer = css`
  display: flex;
  flex-direction: column-reverse;
  @media (min-width: 640px) {
    margin-left: 0.5rem;
    flex-direction: row;
    justify-content: flex-end;
  }
`
const dialog__title = css`
  font-size: 1.125rem;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.025em;
`

const dialog__description = css`
  font-size: 0.875rem;
  line-height: 1.25rem;
`

const dialog__contentTitleBar = css`
  position: fixed;
  top: 0;
  left: 0;
`

function DialogPortal(props: IDialogPortalProps) {
  const context = useDialogContext();
  const [, rest] = splitProps(props, ["children", "closeOnClickOutside$"])

  return (
    <Show when={context.contentPresent$() || context.overlayPresent$()}>
			<Portal {...rest}>
        <AppTitleBarDraggable class={dialog__contentTitleBar} />
        <dialog closedby={props.closeOnClickOutside$ ? "none" : "any"}>
          {props.children}
        </dialog>
        <div class={dialog__portal}>
        </div>
      </Portal>
		</Show>
  )
}

interface IDialogContentProps extends HTMLAttributes<"div"> {
  class?: string | undefined
  children?: JSX.Element
  closeOnClickOutside$?: boolean
  showCloseButton$?: boolean
}

function DialogContent(props: IDialogContentProps) {
  const { close$ } = useDialogContext()

  const [, rest] = splitProps(props as IDialogContentProps, [
    "class",
    "children",
    "closeOnClickOutside$",
    "showCloseButton$"
  ])

  return (
    <DialogPortal closeOnClickOutside$={props.closeOnClickOutside$}>
      <div
        class={`${dialog__content} component-dialog-content ${props.class ?? ""}`}
        {...rest}
      >
        {props.children}
        <Show when={props.showCloseButton$ ?? true}>
          {/* <CloseButton class={dialog__closeButton} onClick={close$}>
            <BsX size={40} />
          </CloseButton> */}
          <></>
        </Show>
      </div>
    </DialogPortal>
  )
}

function DialogHeader(props: HTMLAttributes<"h2">) {
  return (
    <h2 {...props} />
  )
}

function DialogFooter(props: HTMLAttributes<"div">) {
  const [, rest] = splitProps(props, ["class"])
  return (
    <div class={`${dialog__footer} ${props.class ?? ""}`} {...rest} />
  )
}

function DialogTitle(props: HTMLAttributes<"h2">) {
  return (
    <h2
      class={`${dialog__title} ${props.class ?? ""}`}
      {...props}
    />
  )
}

function DialogDescription(props: HTMLAttributes<"p">) {
  return (
    <p
      class={`${dialog__description} ${props.class ?? ""}`}
      {...props}
    />
  )
}

export {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
}
