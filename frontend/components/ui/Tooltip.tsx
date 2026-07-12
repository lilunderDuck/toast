import type { JSX } from "solid-js"
import { Show, splitProps } from "solid-js"

import {
  Root,
  Trigger,
  Portal,
  Content,
  type TooltipRootOptions
} from "@kobalte/core/tooltip"
// ...
import { css } from "molcss"
// ...
import type { HTMLAttributes } from "~/utils"

const tooltip = css`
  overflow: hidden;
  z-index: 1500;
  padding-inline: 0.75rem;
  padding-block: 0.175rem;
  border-radius: 0.375rem;
  border-width: 1;
  font-size: 0.875rem;
  line-height: 1.2rem;
  background-color: var(--mantle);
  border: 1px solid var(--surface1);
  user-select: none;
`

export interface ITooltipOptions {
  tooltipOptions$?: TooltipRootOptions
  label$: JSX.Element
}

export interface ITooltipProps extends HTMLAttributes<"div">, ITooltipOptions {
}

export function Tooltip(props: ITooltipProps) {
  const [local, others] = splitProps(props, [
    /* @__KEY__ */"tooltipOptions$", 
    /* @__KEY__ */"label$", 
    "children"
  ])

  return (
    <Show when={props.label$} fallback={local.children}>
      <Root openDelay={400} closeDelay={0} gutter={4} {...local.tooltipOptions$}>
        <Trigger
          as="div"
          class={css`width: fit-content;`}
        >
          {local.children}
        </Trigger>  
        <Portal>
          <Content
            {...others}
            class={`${tooltip} component-tooltip ${others.class ?? ""}`}
          >
            {local.label$}
          </Content>
        </Portal>
      </Root>
    </Show>
  )
}