import stylex from "@stylexjs/stylex"
import { IconTypes } from "solid-icons"
import { splitProps } from "solid-js"
import { FlexCenter } from "../../../../../components"

const style = stylex.create({
  item: {
    width: 'var(--icon-bound)',
    color: 'var(--gray10)',
    cursor: 'pointer'
  },
  itemContent: {
    width: 'calc(var(--icon-bound) - 8px)',
    height: 'calc(var(--icon-bound) - 8px)',
    borderRadius: 6,
    transition: '0.15s ease-out',
    ':hover': {
      backgroundColor: 'var(--gray3)',
      color: 'var(--gray12)'
    }
  }
})

interface IQuickActionItemProps extends HTMLAttributes<"div"> {
  $icon: IconTypes
}

export default function QuickActionItem(props: IQuickActionItemProps) {
  const [, itsProps] = splitProps(props, ["$icon"])

  return (
    <FlexCenter {...stylex.attrs(style.item)} {...itsProps}>
      <FlexCenter {...stylex.attrs(style.itemContent)}>
        <props.$icon />
      </FlexCenter>
    </FlexCenter>
  )
}