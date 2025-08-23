import { For, type JSX, type ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import { type ITooltipOptions, Tooltip } from "~/components"
import { shorthands } from "~/styles/shorthands"
import { type IconTypes } from "solid-icons"
import { A } from "@solidjs/router"

const style = stylex.create({
  header: {
    paddingInline: 5
  },
  button: {
    padding: 0,
    width: 25,
    height: 25,
    borderRadius: 6,
    backgroundColor: "transparent",
    color: "var(--gray10)",
    ":hover": {
      backgroundColor: "var(--gray4)",
      color: "var(--gray12)",
    }
  }
})

export const INSERT_SPACER_HERE = 1

interface IButtonItemOption {
  tooltipLabel$: JSX.Element
  tooltipDirection$?: ITooltipOptions["tooltipOptions$"]["placement"]
  icon$: IconTypes
  href?: string
  onClick$?: EventHandler<"button", "onClick">
}

export interface IButtonRowProps {
  items$: (IButtonItemOption | typeof INSERT_SPACER_HERE)[]
}

export function ButtonRow(props: IButtonRowProps) {
  const isNotSpacer = (thisThing: IButtonItemOption | typeof INSERT_SPACER_HERE): thisThing is IButtonItemOption => 
    thisThing !== 1  
  // 

  return (
    <For each={props.items$}>
      {it => {
        if (isNotSpacer(it)) {
          const Wrapper = it.href ? A : (props: ParentProps) => <>{props.children}</>
          return (
            <Tooltip label$={it.tooltipLabel$} tooltipOptions$={{
              placement: it.tooltipDirection$
            }}>
              <Wrapper href={it.href}>
                <button {...stylex.attrs(style.button, shorthands.flex_center$)} onClick={it.onClick$}>
                  <it.icon$ />
                </button>
              </Wrapper>
            </Tooltip>
          )
        }

        return <div {...stylex.attrs(shorthands.spacer$)} />
      }}
    </For>
  )
}