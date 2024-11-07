import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
 
import * as DropdownMenuPrimitive from "@kobalte/core/dropdown-menu"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "../../utils"
 
const style = stylex.create({
  menuContent: {
    overflow: "hidden",
    zIndex: 50,
    padding: "0.25rem",
    borderRadius: "0.375rem",
    backgroundColor: 'var(--gray2)',
    border: '1px solid var(--gray4)',
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "relative",
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
    borderRadius: "0.125rem",
    outlineStyle: "none",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transitionProperty: "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms",
    cursor: "default",
    userSelect: "none",
    ':hover': {
      backgroundColor: 'var(--gray3)'
    }
  },
  menuSepartor: {
    paddingInline: '-0.25rem',
    paddingBlock: '0.25rem',
    height: "1px"
  },
  menuShortcut: {
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    opacity: 0.6
  },
  menuLabel: {
    paddingInline: '0.5rem',
    paddingBlock: '0.375rem',
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 600
  },
  menuSubTrigger: {
    display: "flex",
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
    alignItems: "center",
    borderRadius: "0.125rem",
    outlineStyle: "none",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    cursor: "default",
    userSelect: "none"
  },
  menuSubContent: {
    overflow: "hidden",
    zIndex: 50,
    padding: "0.25rem",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  menuCheckboxItem: {
    display: "flex",
    position: "relative",
    paddingBlock: '0.375rem',
    paddingRight: "0.5rem",
    paddingLeft: "2rem",
    alignItems: "center",
    borderRadius: "0.125rem",
    outlineStyle: "none",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transitionProperty: "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms",
    cursor: "default",
    userSelect: "none"
  },
  menuGroupLabel: {
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 600
  },
  menuRadioItem: {
    display: "flex",
    position: "relative",
    paddingBlock: '0.375rem',
    paddingRight: "0.5rem",
    paddingLeft: "2rem",
    alignItems: "center",
    borderRadius: "0.125rem",
    outlineStyle: "none",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transitionProperty: "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms",
    cursor: "default",
    userSelect: "none"
  },
  menuItemIndicator: {
    display: "flex",
    position: "absolute",
    left: "0.5rem",
    justifyContent: "center",
    alignItems: "center"
  }
})
 
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup
 
const DropdownMenu: Component<DropdownMenuPrimitive.DropdownMenuRootProps> = (props) => {
  return <DropdownMenuPrimitive.Root gutter={4} {...props} />
}
 
type DropdownMenuContentProps<T extends ValidComponent = "div"> =
  DropdownMenuPrimitive.DropdownMenuContentProps<T> & {
    class?: string | undefined
  }
 
const DropdownMenuContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuContentProps<T>>
) => {
  const [, rest] = splitProps(props as DropdownMenuContentProps, ["class"])
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        class={mergeClassname(
          props,
          stylex.attrs(style.menuContent)
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  )
}
 
export type DropdownMenuItemProps<T extends ValidComponent = "div"> =
  DropdownMenuPrimitive.DropdownMenuItemProps<T> & {
    class?: string | undefined
  }
// ...

const DropdownMenuItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuItemProps<T>>
) => {
  const [, rest] = splitProps(props as DropdownMenuItemProps, ["class"])
  return (
    <DropdownMenuPrimitive.Item
      class={mergeClassname(
        props,
        stylex.attrs(style.menuItem)
      )}
      {...rest}
    />
  )
}
 
const DropdownMenuShortcut: Component<ComponentProps<"span">> = (props) => {
  const [, rest] = splitProps(props, ["class"])
  return <span class={mergeClassname(
    props,
    stylex.attrs(style.menuShortcut)
  )} {...rest} />
}
 
const DropdownMenuLabel: Component<ComponentProps<"div"> & { inset?: boolean }> = (props) => {
  const [, rest] = splitProps(props, ["class", "inset"])
  return (
    <div
      class={mergeClassname(
        props,
        stylex.attrs(style.menuLabel)
      )}
      {...rest}
    />
  )
}
 
type DropdownMenuSeparatorProps<T extends ValidComponent = "hr"> =
  DropdownMenuPrimitive.DropdownMenuSeparatorProps<T> & {
    class?: string | undefined
  }
 
const DropdownMenuSeparator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, DropdownMenuSeparatorProps<T>>
) => {
  const [, rest] = splitProps(props as DropdownMenuSeparatorProps, ["class"])
  return (
    <DropdownMenuPrimitive.Separator
      class={mergeClassname(
        props,
        stylex.attrs(style.menuSepartor)
      )}
      {...rest}
    />
  )
}
 
type DropdownMenuSubTriggerProps<T extends ValidComponent = "div"> =
  DropdownMenuPrimitive.DropdownMenuSubTriggerProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }
 
const DropdownMenuSubTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuSubTriggerProps<T>>
) => {
  const [, rest] = splitProps(props as DropdownMenuSubTriggerProps, ["class", "children"])
  return (
    <DropdownMenuPrimitive.SubTrigger
      class={mergeClassname(
        props,
        stylex.attrs(style.menuSubContent)
      )}
      {...rest}
    >
      {props.children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="ml-auto size-4"
      >
        <path d="M9 6l6 6l-6 6" />
      </svg>
    </DropdownMenuPrimitive.SubTrigger>
  )
}
 
type DropdownMenuSubContentProps<T extends ValidComponent = "div"> =
  DropdownMenuPrimitive.DropdownMenuSubContentProps<T> & {
    class?: string | undefined
  }
 
const DropdownMenuSubContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuSubContentProps<T>>
) => {
  const [, rest] = splitProps(props as DropdownMenuSubContentProps, ["class"])
  return (
    <DropdownMenuPrimitive.SubContent
      class={mergeClassname(
        props,
        stylex.attrs(style.menuSubContent)
      )}
      {...rest}
    />
  )
}
 
type DropdownMenuCheckboxItemProps<T extends ValidComponent = "div"> =
  DropdownMenuPrimitive.DropdownMenuCheckboxItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }
 
const DropdownMenuCheckboxItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuCheckboxItemProps<T>>
) => {
  const [, rest] = splitProps(props as DropdownMenuCheckboxItemProps, ["class", "children"])
  return (
    <DropdownMenuPrimitive.CheckboxItem
      class={mergeClassname(
        props,
        stylex.attrs(style.menuCheckboxItem)
      )}
      {...rest}
    >
      <span {...stylex.attrs(style.menuItemIndicator)}>
        <DropdownMenuPrimitive.ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {props.children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}
 
type DropdownMenuGroupLabelProps<T extends ValidComponent = "span"> =
  DropdownMenuPrimitive.DropdownMenuGroupLabelProps<T> & {
    class?: string | undefined
  }
 
const DropdownMenuGroupLabel = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, DropdownMenuGroupLabelProps<T>>
) => {
  const [, rest] = splitProps(props as DropdownMenuGroupLabelProps, ["class"])
  return (
    <DropdownMenuPrimitive.GroupLabel
      class={mergeClassname(
        props,
        stylex.attrs(style.menuGroupLabel)
      )}
      {...rest}
    />
  )
}
 
type DropdownMenuRadioItemProps<T extends ValidComponent = "div"> =
  DropdownMenuPrimitive.DropdownMenuRadioItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }
 
const DropdownMenuRadioItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuRadioItemProps<T>>
) => {
  const [, rest] = splitProps(props as DropdownMenuRadioItemProps, ["class", "children"])
  return (
    <DropdownMenuPrimitive.RadioItem
      class={mergeClassname(
        props,
        stylex.attrs(style.menuRadioItem)
      )}
      {...rest}
    >
      <span {...stylex.attrs(style.menuItemIndicator)}>
        <DropdownMenuPrimitive.ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-2 fill-current"
          >
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          </svg>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {props.children}
    </DropdownMenuPrimitive.RadioItem>
  )
}
 
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
}