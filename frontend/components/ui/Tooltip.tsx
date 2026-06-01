import type { JSX } from "solid-js"
import { splitProps } from "solid-js"

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
  line-height: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: var(--mantle);
  border: 1px solid var(--surface1);
  user-select: none;
`

const tooltip__trigger = css`
  width: fit-content;
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
    <Root openDelay={0} closeDelay={0} gutter={4} {...local.tooltipOptions$}>
      <Trigger
        as="div"
        class={tooltip__trigger}
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
  )
}