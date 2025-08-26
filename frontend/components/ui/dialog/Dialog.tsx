import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js"
import { Show, splitProps } from "solid-js"
import * as DialogPrimitive from "@kobalte/core/dialog"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
// ...
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from'~/styles/scrollbar.module.css'
import { BsX } from "solid-icons/bs"

const style = stylex.create({
  portal: {
    zIndex: 900,
    width: "100%",
    height: "100%",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    // alignItems: "flex-start",
    alignItems: "center",
  },
  overlay: {
    position: "fixed",
    width: "100%",
    height: "100%",
    zIndex: 900,
    backdropFilter: "blur(4px)",
    backgroundColor: "#000000ab",
  },
  content: {
    paddingInline: 15,
    paddingBlock: 10,
    backgroundColor: "var(--gray2)",
    position: "relative"
  },
  closeButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    width: 30,
    height: 30,
    borderRadius: "0.125rem",
    transitionProperty: "opacity",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms",
    opacity: 0.7,
    zIndex: 10,
    outline: "none",
    backgroundColor: "var(--gray5)",
    ":hover": {
      opacity: 1,
    },
  },
  header: {
    display: "flex",
    marginTop: "0.375rem",
    flexDirection: "column",
    textAlign: "center",
    "@media (min-width: 640px)": {
      textAlign: "left",
    },
  },
  footer: {
    display: "flex",
    flexDirection: "column-reverse",
    "@media (min-width: 640px)": {
      marginLeft: "0.5rem",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  },
  title: {
    fontSize: "1.125rem",
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: "-0.025em",
  },
  description: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
})

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

interface IDialogPortalProps extends DialogPrimitive.DialogPortalProps {
  closeOnClickOutside$?: boolean
}

const DialogPortal: Component<IDialogPortalProps> = (props) => {
  const [, rest] = splitProps(props, ["children", "closeOnClickOutside$"])

  return (
    <DialogPrimitive.Portal {...rest}>
      <Show
        when={props.closeOnClickOutside$ === false}
        fallback={<DialogOverlay />}
      >
        <div dont-close {...stylex.attrs(style.overlay)} />
      </Show>
      <div {...stylex.attrs(style.portal)}>
        {props.children}
      </div>
    </DialogPrimitive.Portal>
  )
}

type DialogOverlayProps<T extends ValidComponent = "div"> =
  & DialogPrimitive.DialogOverlayProps<T>
  & {
    class?: string | undefined
  }
// ...

const DialogOverlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogOverlayProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogOverlayProps, ["class"])
  return (
    <DialogPrimitive.Overlay
      class={mergeClassname(props, stylex.attrs(style.overlay))}
      {...rest}
    />
  )
}

// export type DialogContentOp

type DialogContentProps<T extends ValidComponent = "div"> =
  & DialogPrimitive.DialogContentProps<T>
  & {
    class?: string | undefined
    children?: JSX.Element
    closeOnClickOutside$?: boolean
    showCloseButton$?: boolean
  }
// ...

const DialogContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogContentProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogContentProps, [
    "class",
    "children",
    "closeOnClickOutside$",
    "showCloseButton$"
  ])

  return (
    <DialogPortal closeOnClickOutside$={props.closeOnClickOutside$}>
      <DialogPrimitive.Content
        class={mergeClassname(props, stylex.attrs(style.content))}
        {...rest}
      >
        {props.children}
        <Show when={props.showCloseButton$ ?? true}>
          <DialogPrimitive.CloseButton {...stylex.attrs(style.closeButton)}>
            <BsX />
          </DialogPrimitive.CloseButton>
        </Show>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

const DialogHeader: Component<ComponentProps<"h2">> = (props) => {
  // const [, rest] = splitProps(props, ["class"])
  return (
    // <h2 class={mergeClassname(props, stylex.attrs(style.header))} {...rest} />
    <h2 {...props} />
  )
}

const DialogFooter: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"])
  return (
    <div class={mergeClassname(props, stylex.attrs(style.footer))} {...rest} />
  )
}

type DialogTitleProps<T extends ValidComponent = "h2"> =
  & DialogPrimitive.DialogTitleProps<T>
  & {
    class?: string | undefined
  }
// ...

const DialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, DialogTitleProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogTitleProps, ["class"])
  return (
    <DialogPrimitive.Title
      class={mergeClassname(props, stylex.attrs(style.title))}
      {...rest}
    />
  )
}

type DialogDescriptionProps<T extends ValidComponent = "p"> =
  & DialogPrimitive.DialogDescriptionProps<T>
  & {
    class?: string | undefined
  }
// ...

const DialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, DialogDescriptionProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogDescriptionProps, ["class"])
  return (
    <DialogPrimitive.Description
      class={mergeClassname(props, stylex.attrs(style.description))}
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
  DialogTrigger,
}
