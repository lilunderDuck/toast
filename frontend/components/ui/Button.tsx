import type { JSX, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { ButtonRootProps, Root } from "@kobalte/core/button"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Button.module.css"
// ...
import { defaultValueOrElse, mergeClassname, type StylexStylesAttribute } from "../../utils"

const style = stylex.create({
  base: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 500,
    transitionProperty: "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms"
  },
  size_default: {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    height: "2.5rem"
  },
  size_small: {
    paddingInline: "0.65rem",
    paddingBlock: '0.275rem',
    borderRadius: "0.275rem"
  },
  size_large: {
    paddingLeft: "2rem",
    paddingRight: "2rem",
    borderRadius: "0.375rem",
    height: "2.75rem"
  },
  size_icon: {
    paddingInline: '0.375rem',
    paddingBlock: '0.375rem',
  },
  variant_default: {
    backgroundColor: 'var(--gray5)',
    ':hover': {
      backgroundColor: 'var(--gray6)',
    }
  },
  variant_danger: {
    backgroundColor: 'var(--red7)',
    ':hover': {
      backgroundColor: 'var(--red9)',
    }
  }
})

const variantMapping: Record<ButtonVariant, StylexStylesAttribute> = {
  [ButtonVariant.default]: stylex.attrs(style.variant_default),
  [ButtonVariant.danger]: stylex.attrs(style.variant_danger)
  // outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  // secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  // ghost: "hover:bg-accent hover:text-accent-foreground",
  // link: "text-primary underline-offset-4 hover:underline"
}

const sizeMapping: Record<ButtonSize, StylexStylesAttribute> = {
  [ButtonSize.default]: stylex.attrs(style.size_default),
  [ButtonSize.sm]: stylex.attrs(style.size_small),
  [ButtonSize.lg]: stylex.attrs(style.size_large),
  [ButtonSize.icon]: stylex.attrs(style.size_icon)
}
 
export type ButtonProps<T extends ValidComponent = "button"> = ButtonRootProps<T> &
  { 
    class?: string | undefined
    children?: JSX.Element 
    variant$?: ButtonVariant
    size$?: ButtonSize
  }
// ...

export function Button<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ButtonProps<T>>
) {
  const [local, others] = splitProps(props as ButtonProps, ["variant$", "size$"])
  return (
    <Root
      {...others}
      class={mergeClassname(
        others,
        __style.button,
        stylex.attrs(style.base),
        defaultValueOrElse(variantMapping, local.variant$, ButtonVariant.default),
        defaultValueOrElse(sizeMapping, local.size$, ButtonSize.default),
      )}
    />
  )
}