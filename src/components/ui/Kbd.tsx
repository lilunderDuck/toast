import stylex from "@stylexjs/stylex"
import { ParentProps } from "solid-js"

const style = stylex.create({
  kbd: {
    borderStyle: 'solid',
    borderRadius: '0.375rem',
    borderColor: 'var(--gray7)',
    borderWidth: '1px 1px 3px',
    backgroundColor: '#131212',
    paddingInline: '0.4em',
    fontFamily: 'consolas',
    fontSize: '0.8em',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  }
})

export function Kbd(props: ParentProps) {
  return (
    <kbd {...stylex.attrs(style.kbd)}>
      {props.children}
    </kbd>
  )
}