import stylex from "@stylexjs/stylex"
import { IconTypes } from "solid-icons"
import { FlexCenter, Tooltip } from "~/components"

const style = stylex.create({
  item: {
    width: 30,
    height: 30,
    cursor: 'pointer',
    transition: '0.15s ease-out',
    backgroundColor: 'var(--gray3)',
    ':hover': {
      backgroundColor: 'var(--gray5)',
    },
    ':first-child': {
      borderTopLeftRadius: 6,
      borderBottomLeftRadius: 6
    },
    ':last-child': {
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6
    }
  },
  active: {
    backgroundColor: 'var(--gray4)',
  }
})

interface IBubbleMenuItemProps {
  // $name: string
  $icon: IconTypes
  $label: string
  $onClick(): any
  $active?: () => boolean
}

export default function BubbleMenuItem(props: IBubbleMenuItemProps) {
  return (
    <Tooltip $label={props.$label}>
      <FlexCenter {...stylex.attrs(
        style.item,
        props.$active?.() ? style.active : {}
      )} $as="button" onClick={props.$onClick}>
        <props.$icon />
      </FlexCenter>
    </Tooltip>
  )
}