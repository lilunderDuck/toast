import { IconTypes } from "solid-icons"
import { splitProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./QuickActionBar.module.css"
// ...
import { FlexCenter } from "~/components"

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
}

export function QuickActionItem(props: IQuickActionItemProps) {
  const [, itsProps] = splitProps(props, ["$icon"])

  return (
    <FlexCenter {...stylex.attrs(style.item)} {...itsProps} id={__style.actionBar}>
      <FlexCenter {...stylex.attrs(style.itemContent)}>
        <props.$icon size={13} />
      </FlexCenter>
    </FlexCenter>
  )
}