import stylex from "@stylexjs/stylex"
import type { JSX } from "solid-js"

const style = stylex.create({
  theTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  tagIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'calc(var(--journal-status-bar-width) - 7px)',
    height: 'calc(var(--journal-status-bar-width) - 7px)',
    padding: 5,
    backgroundColor: 'var(--tag-bg-color)',
    color: 'var(--tag-color)',
    borderRadius: 6
  }
})

interface ITagProps {
  name: JSX.Element
  color?: string
  bgColor?: string
  icon?: JSX.Element
}

export default function TagWithIcon(props: ITagProps) {
  return (
    <span {...stylex.attrs(style.theTag)} style={{
      '--tag-color': props.color,
      '--tag-bg-color': props.bgColor
    }}>
      <span {...stylex.attrs(style.tagIcon)}>
        {props.icon}
      </span>
      {props.name}
    </span>
  )
}