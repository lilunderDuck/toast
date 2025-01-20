import { IconTypes } from "solid-icons"
import { JSX, splitProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./QuickActionBar.module.css"
// ...
import { FlexCenter, Tooltip } from "~/components"

const style = stylex.create({
  item: {
    width: 'var(--icon-bound)',
    color: 'var(--gray9)',
    cursor: 'pointer'
  },
  itemContent: {
    width: 'var(--icon-content)',
    height: 'var(--icon-content)',
    borderRadius: 6,
    transition: '0.15s ease-out',
    ':hover': {
      backgroundColor: 'var(--gray5)',
      color: 'var(--gray10)'
    }
  }
})

interface IQuickActionItemProps extends HTMLAttributes<"div"> {
  $icon: IconTypes
  label$: JSX.Element
}

export function QuickActionItem(props: IQuickActionItemProps) {
  const [thisThing, itsProps] = splitProps(props, ["$icon", "label$"])

  return (
    <FlexCenter {...stylex.attrs(style.item)} {...itsProps} id={__style.actionBar}>
      <Tooltip label$={thisThing.label$}>
        <FlexCenter {...stylex.attrs(style.itemContent)}>
          <props.$icon size={13} />
        </FlexCenter>
      </Tooltip>
    </FlexCenter>
  )
}