import type { JSX } from "solid-js"
import { splitProps } from "solid-js"

import {
  Root,
  Trigger,
  Portal,
  Content,
  type TooltipRootOptions
} from "@kobalte/core/tooltip"
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  tooltip: {
    overflow: "hidden",
    zIndex: 1500,
    paddingInline: "0.75rem",
    paddingBlock: "0.175rem",
    borderRadius: "0.375rem",
    borderWidth: 1,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    backgroundColor: 'var(--gray2)',
    border: '1px solid var(--gray5)',
    userSelect: 'none'
  },
})

export interface ITooltipOptions {
  tooltipOptions$?: TooltipRootOptions
  label$: JSX.Element
}

interface ITooltipProps extends HTMLAttributes<"div">, ITooltipOptions {}

export function Tooltip(
  props: ITooltipProps
) {
  const [local, others] = splitProps(props, [
    /* @__KEY__ */"tooltipOptions$", 
    /* @__KEY__ */"label$", 
    "children"
  ])

  return (
    <Root openDelay={0} closeDelay={0} gutter={4} {...local.tooltipOptions$}>
      <Trigger as="div">
        {local.children}
      </Trigger>
      <Portal>
        <Content
          {...others}
          class={mergeClassname(stylex.attrs(style.tooltip), others)}
        >
          {local.label$}
        </Content>
      </Portal>
    </Root>
  )
}