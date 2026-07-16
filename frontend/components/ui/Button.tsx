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
  line-height: 1.25rem;
  outline: none;
`

const variantMapping: Record<ButtonVariant, string> = {
  [ButtonVariant.DEFAULT]: css`
    background-color: var(--surface0);
    color: var(--subtext0);
    &:not(:disabled):hover {
      background-color: var(--surface2);
      color: var(--text);
    }
  `,
  [ButtonVariant.DANGER]: css`
    background-color: #aa3e5c;
    &:not(:disabled):hover {
      background-color: #cc5576;
    }
  `,
  [ButtonVariant.NO_BACKGROUND]: css`
    background-color: transparent;
    color: var(--subtext0);
    &:not(:disabled):hover {
      background-color: var(--surface1);
      color: var(--text);
    }
  `,
  [ButtonVariant.SECONDARY]: css`
    background-color: #46a4cf;
    color: var(--surface0);
    &:not(:disabled):hover {
      background-color: #74c7ec;
      color: var(--crust);
    }
  `,
  [ButtonVariant.UNSET]: "",
  [ButtonVariant.OUTLINE]: "",
  [ButtonVariant.GHOST]: "",
  [ButtonVariant.LINK]: ""
}

// outline: "border border-input hover:bg-accent hover:text-accent-foreground",
// secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
// ghost: "hover:bg-accent hover:text-accent-foreground",
// link: "text-primary underline-offset-4 hover:underline"
const sizeMapping: Record<ButtonSize, string> = {
  [ButtonSize.DEFAULT]: css`
    /* padding-top: 0.5rem; */
    /* padding-bottom: 0.5rem; */
    /* padding-left: 1rem; */
    /* padding-right: 1rem; */
    /* height: 2.5rem; */
    padding-inline: 0.65rem;
    padding-block: 0.275rem;
    border-radius: 0.275rem;
  `,
  // [ButtonSize.SMALL]: css`
  // `,
  [ButtonSize.LARGE]: css`
    padding-left: 2rem;
    padding-right: 2rem;
    border-radius: 0.375rem;
    height: 2.75rem;
  `,
  [ButtonSize.ICON]: css`
    padding-inline: 0.375rem;
    padding-block: 0.375rem;
    color: var(--subtext0);
    &:not(:disabled):hover {
      color: var(--text);
    }
  `,
  [ButtonSize.ICON_LARGE]: css`
    padding-inline: 0.575rem;
    padding-block: 0.575rem;
    color: var(--subtext0);
    &:not(:disabled):hover {
      color: var(--text);
    }
  `,
  [ButtonSize.UNSET]: ""
}

export interface IButtonProps extends HTMLAttributes<"button"> {
  variant$?: ButtonVariant
  size$?: ButtonSize
}

export function Button(props: IButtonProps) {
  const [local, others] = splitProps(props, ["variant$", "size$"])
  
  const buttonVariant = variantMapping[local.variant$ ?? ButtonVariant.DEFAULT]
  const buttonSize = sizeMapping[local.size$ ?? ButtonSize.DEFAULT]

  return (
    <button
      type="button"
      {...others}
      class={`${base} ${buttonVariant} ${buttonSize} ${others.class ?? ""}`}
    >
      {props.children}
    </button>
  )
}