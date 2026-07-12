import type { JSX } from "solid-js"
import { Show, splitProps } from "solid-js"
import { Portal } from "solid-js/web"
import { BsX } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { AppTitleBarDraggable } from "~/components/window"
import type { HTMLAttributes } from "~/utils"
// ...
import type { IDialogPortalProps } from "./types"
import { useDialogContext } from "./DialogContext"

const dialog__this = css`
  z-index: 30;
  width: 100%;
  height: 100%;
  position: fixed;
  padding: 0;
  background-color: #11111b8d;
  backdrop-filter: blur(3px);
  color: var(--text);
  display: flex;
  justify-content: center;
  align-items: center;
`

const dialog__content = css`
  padding-inline: 15px;
  padding-block: 10px;
  background-color: var(--mantle);
  position: relative;
  outline: none;
  border-radius: 6px;
`

const dialog__closeButton = css`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  opacity: 0.7;
  z-index: 10;
  outline: none;
  background-color: var(--surface1);
  &:hover {
    opacity: 1;
  }
`

const dialog__contentTitleBar = css`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 35;
`

function DialogPortal(props: IDialogPortalProps) {
  const context = useDialogContext();
  const [, rest] = splitProps(props, ["children", "closeOnClickOutside$"])

  return (
    <Show when={context.isOpen$()}>
			<Portal {...rest}>
        <dialog class={dialog__this} open={context.isOpen$()} closedby={props.closeOnClickOutside$ ? "none" : "any"}>
          {props.children}
        </dialog>
        <AppTitleBarDraggable class={dialog__contentTitleBar} />
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

export function DialogContent(props: IDialogContentProps) {
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
        class={`${dialog__content} ${props.class ?? ""}`}
        {...rest}
      >
        {props.children}
        <Show when={props.showCloseButton$ ?? true}>
          <button class={dialog__closeButton} onClick={close$}>
            <BsX size={40} />
          </button>
          <></>
        </Show>
      </div>
    </DialogPortal>
  )
}