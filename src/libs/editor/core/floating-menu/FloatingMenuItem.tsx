import stylex from "@stylexjs/stylex"
import { IconTypes } from "solid-icons"
import { FlexCenterY } from "~/components"

const style = stylex.create({
  item: {
    cursor: 'pointer',
    transition: '0.15s ease-out',
    backgroundColor: 'var(--gray3)',
    color: 'var(--gray11)',
    paddingInline: 10,
    paddingBlock: 5,
    fontSize: 13,
    gap: 20,
    ':hover': {
      backgroundColor: 'var(--gray5)',
      color: 'var(--gray12)',
    },
    ':first-child': {
      borderTopLeftRadius: 6,
      borderBottomLeftRadius: 6
    },
    ':last-child': {
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6
    }
  }
})

interface IFloatingMenuItemProps {
  $onClick(): void
  $name: string
  $icon: IconTypes
}

export default function FloatingMenuItem(props: IFloatingMenuItemProps) {
  return (
    <FlexCenterY {...stylex.attrs(style.item)} onClick={props.$onClick}>
      <props.$icon />
      <span>{props.$name}</span>
    </FlexCenterY>
  )
}