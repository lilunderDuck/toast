import { BsX } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Journal.module.css"
// ...
import type { JournalData } from "~/api"
import { FlexCenterY, Spacer } from "~/components"

const style = stylex.create({
  journal: {
    fontSize: 13,
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    transition: '0.15s ease-out',
    userSelect: 'none',
    ':hover': {
      backgroundColor: 'var(--gray3)'
    }
  },
  button: {
    flexShrink: 0,
    padding: 0,
    color: 'var(--gray11)',
    cursor: 'pointer',
    ':hover': {
      color: 'var(--gray12)'
    }
  }
})

interface IJournalProps extends JournalData {
  onClick?: EventHandler<"div", "onClick">
}

export function Journal(props: IJournalProps) {
  return (
    <FlexCenterY 
      {...stylex.attrs(style.journal)} 
      id={__style.journal} 
      onClick={props.onClick}
    >
      <span>
        {props.name}
      </span>
      <Spacer />
      <div {...stylex.attrs(style.button)}>
        <BsX size={15} id={__style.button} />
      </div>
    </FlexCenterY>
  )
}