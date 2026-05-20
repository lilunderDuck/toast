import { createSignal, Show, splitProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { SpinningCube } from "../loader"
import { CLS } from "macro-def"

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
    transitionDuration: "300ms",
    outline: "none",
    color: "var(--subtext0)",
    ":hover": {
      color: "var(--text)",
    }
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
    color: 'var(--subtext0)',
    ':hover': {
      color: 'var(--text)',
    }
  },
  variant_default: {
    backgroundColor: 'var(--surface1)',
    ':hover': {
      backgroundColor: 'var(--surface2)',
    }
  },
  variant_danger: {
    backgroundColor: '#aa3e5c',
    ':hover': {
      backgroundColor: '#cc5576',
    }
  },
  variant_noBackground: {
    backgroundColor: 'tranparent',
    color: 'var(--subtext0)',
    ':hover': {
      backgroundColor: 'var(--surface1)',
      color: 'var(--text)'
    }
  }
})

const variantMapping: Record<ButtonVariant, string> = {
  [ButtonVariant.DEFAULT]: CLS(style.variant_default),
  [ButtonVariant.DANGER]: CLS(style.variant_danger),
  [ButtonVariant.NO_BACKGROUND]: CLS(style.variant_noBackground),
  [ButtonVariant.UNSET]: ""
  // outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  // secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  // ghost: "hover:bg-accent hover:text-accent-foreground",
  // link: "text-primary underline-offset-4 hover:underline"
}

const sizeMapping: Record<ButtonSize, string> = {
  [ButtonSize.DEFAULT]: CLS(style.size_default),
  [ButtonSize.SMALL]: CLS(style.size_small),
  [ButtonSize.LARGE]: CLS(style.size_large),
  [ButtonSize.ICON]: CLS(style.size_icon),
  [ButtonSize.UNSET]: ""
}

export interface IButtonProps extends HTMLAttributes<"button"> {
  variant$?: ButtonVariant
  size$?: ButtonSize
}

export function Button(props: IButtonProps) {
  const [local, others] = splitProps(props, ["variant$", "size$"])
  const [isLoading, setIsLoading] = createSignal(false)

  const clickHandler: EventHandler<"button", "onClick"> = async(mouseEvent) => {
    if (isLoading()) return
    
    const thisOnClickCallback = props.onClick
    if (!thisOnClickCallback) return

    if (thisOnClickCallback instanceof Promise) {
      setIsLoading(true)
      await thisOnClickCallback(mouseEvent)
      setIsLoading(false)
    } else {
      thisOnClickCallback(mouseEvent)
    }
  }

  return (
    <button
      type="button"
      disabled={isLoading()}
      {...others}
      onClick={clickHandler}
      class={`${others.class ?? ""} ${CLS(style.base)} ${variantMapping[local.variant$ ?? ButtonVariant.DEFAULT]} ${sizeMapping[local.size$ ?? ButtonSize.DEFAULT]}`}
    >
      <Show when={isLoading()} fallback={props.children}>
        <SpinningCube cubeSize$={30} />
      </Show>
    </button>
  )
}