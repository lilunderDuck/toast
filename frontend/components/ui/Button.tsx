import { splitProps } from "solid-js"
// ...
import { css } from "molcss"
// ...
import type { HTMLAttributes } from "~/utils"

const base = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  outline: none;
  color: var(--subtext0);
  &:hover {
    color: var(--text);
  }
`

const size_default = css`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 2.5rem;
`

const size_small = css`
  padding-inline: 0.65rem;
  padding-block: 0.275rem;
  border-radius: 0.275rem;
`

const size_large = css`
  padding-left: 2rem;
  padding-right: 2rem;
  border-radius: 0.375rem;
  height: 2.75rem;
`

const size_icon = css`
  padding-inline: 0.375rem;
  padding-block: 0.375rem;
  color: var(--subtext0);
  &:hover {
    color: 'var(--text)'
  }
`

const variant_default = css`
  background-color: var(--surface1);
  &:hover {
    background-color: var(--surface2);
  }
`

const variant_danger = css`
  background-color: #aa3e5c;
  &:hover {
    background-color: #cc5576;
  }
`

const variant_noBackground = css`
  background-color: tranparent;
  color: var(--subtext0);
  &:hover {
    background-color: var(--surface1);
    color: var(--text);
  }
`

const variantMapping: Record<ButtonVariant, string> = {
  [ButtonVariant.DEFAULT]: variant_default,
  [ButtonVariant.DANGER]: variant_danger,
  [ButtonVariant.NO_BACKGROUND]: variant_noBackground,
  [ButtonVariant.UNSET]: ""
  // outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  // secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  // ghost: "hover:bg-accent hover:text-accent-foreground",
  // link: "text-primary underline-offset-4 hover:underline"
}

const sizeMapping: Record<ButtonSize, string> = {
  [ButtonSize.DEFAULT]: size_default,
  [ButtonSize.SMALL]: size_small,
  [ButtonSize.LARGE]: size_large,
  [ButtonSize.ICON]: size_icon,
  [ButtonSize.UNSET]: ""
}

export interface IButtonProps extends HTMLAttributes<"button"> {
  variant$?: ButtonVariant
  size$?: ButtonSize
}

export function Button(props: IButtonProps) {
  const [local, others] = splitProps(props, ["variant$", "size$"])

  return (
    <button
      type="button"
      disabled={isLoading()}
      {...others}
      class={`${base} ${variantMapping[local.variant$ ?? ButtonVariant.DEFAULT]} ${sizeMapping[local.size$ ?? ButtonSize.DEFAULT]} ${others.class ?? ""}`}
    >
      {props.children}
    </button>
  )
}