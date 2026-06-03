import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js"
import { Show, splitProps } from "solid-js"
import { BsX } from "solid-icons/bs"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { CloseButton, Content, Overlay, Portal, Root, useDialogContext, type DialogContentProps, type DialogDescriptionProps, type DialogPortalProps, type DialogTitleProps } from "@kobalte/core/dialog"
// ...
import '~/styles/scrollbar.css'
import { css } from "molcss"
// ...

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
  border-radius: 6;
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
    marginLeft: 0.5rem;
    flexDirection: row;
    justifyContent: flex-end;
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

const Dialog = Root

interface IDialogPortal extends DialogPortalProps {
  closeOnClickOutside$?: boolean
}

const DialogPortal: Component<IDialogPortal> = (props) => {
  const [, rest] = splitProps(props, ["children", "closeOnClickOutside$"])

  return (
    <Portal {...rest}>
      <Show
        when={props.closeOnClickOutside$ === false}
        fallback={<Overlay
          class={`${dialog__overlay} component-dialog-overlay`}
          {...rest}
        />}
      >
        <div dont-close class={dialog__overlay} />
      </Show>
      <div class={dialog__portal}>
        {props.children}
      </div>
    </Portal>
  )
}

interface IDialogContentProps<T extends ValidComponent = "div"> extends DialogContentProps<T> {
  class?: string | undefined
  children?: JSX.Element
  closeOnClickOutside$?: boolean
  showCloseButton$?: boolean
}

const DialogContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDialogContentProps<T>>,
) => {
  const { close } = useDialogContext()

  const [, rest] = splitProps(props as IDialogContentProps, [
    "class",
    "children",
    "closeOnClickOutside$",
    "showCloseButton$"
  ])

  return (
    <DialogPortal closeOnClickOutside$={props.closeOnClickOutside$}>
      <Content
        class={`${dialog__content} component-dialog-content ${props.class ?? ""}`}
        {...rest}
      >
        {props.children}
        <Show when={props.showCloseButton$ ?? true}>
          <CloseButton class={dialog__closeButton} onClick={close}>
            <BsX size={40} />
          </CloseButton>
        </Show>
      </Content>
    </DialogPortal>
  )
}

const DialogHeader: Component<ComponentProps<"h2">> = (props) => {
  return (
    <h2 {...props} />
  )
}

const DialogFooter: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"])
  return (
    <div class={`${dialog__footer} ${props.class ?? ""}`} {...rest} />
  )
}

interface IDialogTitleProps<T extends ValidComponent = "h2"> extends DialogTitleProps<T> {
  class?: string | undefined
}

const DialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, IDialogTitleProps<T>>,
) => {
  const [, rest] = splitProps(props as IDialogTitleProps, ["class"])
  return (
    <h2
      class={`${dialog__title} ${props.class ?? ""}`}
      {...rest}
    />
  )
}

interface IDialogDescriptionProps<T extends ValidComponent = "p"> extends DialogDescriptionProps<T> {
  class?: string | undefined
}

const DialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, IDialogDescriptionProps<T>>,
) => {
  const [, rest] = splitProps(props as IDialogDescriptionProps, ["class"])
  return (
    <p
      class={`${dialog__description} ${props.class ?? ""}`}
      {...rest}
    />
  )
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
}
