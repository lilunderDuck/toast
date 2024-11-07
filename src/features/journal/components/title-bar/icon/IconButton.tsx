import stylex from "@stylexjs/stylex"
import type { IconTypes } from "solid-icons"
import { splitProps } from "solid-js"
import { FlexCenter } from "../../../../../components"
import { mergeClassname } from "../../../../../utils"

const style = stylex.create({
  $button: {
    padding: 0,
    border: 'none',
    width: 'calc(var(--bound) - 10px)',
    height: 'calc(var(--bound) - 10px)',
    backgroundColor: 'transparent',
    borderRadius: 6,
    color: 'var(--gray10)',
    ':hover': {
      backgroundColor: 'var(--gray3)',
      color: 'var(--gray11)',
    }
  }
})

interface IIconButtonProps extends HTMLAttributes<"button"> {
  $icon?: IconTypes
  $size?: number
}

export function IconButton(props: IIconButtonProps) {
  const [, itsProps] = splitProps(props, ["$icon", "$size"])

  return (
    <FlexCenter 
      {...itsProps} 
      style={{
        '--bound': 'var(--journal-title-bar-thickness)'
      }} 
      class={mergeClassname(
        props, 
        stylex.attrs(style.$button)
      )} 
      $as="button"
    >
      {props.$icon && <props.$icon size={props.$size ?? 7} />}
    </FlexCenter>
  )
}

export function SmallIconButton(props: IIconButtonProps) {
  return (
    <IconButton {...props} style={{
      '--bound': 'calc(var(--journal-title-bar-thickness) - 5px)'
    }} />
  )
}